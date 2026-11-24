import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';
import Match from '../models/Match.js';
import User from '../models/User.js';
import { executeCode } from '../services/judgeService.js';
import { finalizeMatch } from '../services/matchService.js';
import { emitBattleResult } from '../sockets/battleSocket.js';

// POST /api/submissions/run
// Run code against a custom stdin (sample test only — no hidden test cases)
export const runCode = async (req, res, next) => {
  try {
    const { problemId, sourceCode, language, stdin } = req.body;

    if (!sourceCode || !language) {
      return res.status(400).json({ success: false, message: 'Source code and language are required' });
    }

    let timeLimit = 2;
    let memoryLimit = 256000;

    if (problemId) {
      const problem = await Problem.findById(problemId).select('timeLimit memoryLimit');
      if (problem) {
        timeLimit = problem.timeLimit / 1000;
        memoryLimit = problem.memoryLimit * 1024;
      }
    }

    const result = await executeCode(sourceCode, language, stdin || '', timeLimit, memoryLimit);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// POST /api/submissions/submit
// Full submission evaluated against all hidden test cases
export const submitSolution = async (req, res, next) => {
  try {
    const { problemId, sourceCode, language, matchId } = req.body;

    if (!problemId || !sourceCode || !language) {
      return res.status(400).json({
        success: false,
        message: 'Problem, source code, and language are required',
      });
    }

    // ── BUG 5 FIX: Verify user is a participant before running any code ──────
    if (matchId) {
      const matchCheck = await Match.findById(matchId).select('players status');
      if (!matchCheck) {
        return res.status(404).json({ success: false, message: 'Battle not found' });
      }
      const isParticipant = matchCheck.players.some(
        p => p.user.toString() === req.user._id.toString()
      );
      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: 'Access denied — you are not a participant in this battle',
        });
      }
      if (matchCheck.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'This battle is not active',
        });
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Fetch problem WITH hidden test cases (overriding the default select: false)
    const problem = await Problem.findById(problemId).select('+hiddenTestCases');
    if (!problem || !problem.isActive) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const allTestCases = [...(problem.sampleTestCases || []), ...(problem.hiddenTestCases || [])];
    if (!allTestCases.length) {
      return res.status(400).json({ success: false, message: 'No test cases available' });
    }

    let passedCount = 0;
    let finalVerdict = 'Accepted';
    let totalTime = 0;
    let maxMemory = 0;
    let errorOutput = '';

    // Run against each test case sequentially — stop on first failure
    for (const testCase of allTestCases) {
      const result = await executeCode(
        sourceCode,
        language,
        testCase.input,
        problem.timeLimit / 1000,
        problem.memoryLimit * 1024
      );

      if (result.time) totalTime += result.time;
      if (result.memory) maxMemory = Math.max(maxMemory, result.memory);

      let passed = false;
      if (result.verdict === 'Accepted' || result.verdict === 'Wrong Answer') {
        passed = result.output.trim() === testCase.expectedOutput.trim();
        if (!passed && finalVerdict === 'Accepted') finalVerdict = 'Wrong Answer';
      } else {
        // Runtime Error, TLE, CE, etc.
        if (finalVerdict === 'Accepted') {
          finalVerdict = result.verdict;
          errorOutput = result.errorOutput;
        }
      }

      if (passed) {
        passedCount++;
      } else {
        break; // Stop on first failure
      }
    }

    if (passedCount === allTestCases.length) {
      finalVerdict = 'Accepted';
    }

    // Create submission record in DB
    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      match: matchId || null,
      sourceCode,
      language,
      verdict: finalVerdict,
      executionTime: totalTime,
      memoryUsed: maxMemory,
      output: '',
      errorOutput,
      testCasesPassed: passedCount,
      totalTestCases: allTestCases.length,
    });

    // Handle accepted submission during a battle
    if (finalVerdict === 'Accepted' && matchId) {
      const match = await Match.findById(matchId);
      if (match && match.status === 'active') {
        const playerIndex = match.players.findIndex(
          p => p.user.toString() === req.user._id.toString()
        );

        if (playerIndex !== -1 && !match.players[playerIndex].hasSubmitted) {
          match.players[playerIndex].hasSubmitted = true;
          match.players[playerIndex].submissionVerdict = 'Accepted';
          match.players[playerIndex].submittedAt = new Date();
          match.submissions.push(submission._id);

          await match.save();

          // Finalize the match — this user is the winner
          const finalizedMatch = await finalizeMatch(match, req.user._id);

          // ── BUG 8 FIX: Emit battle_finished to BOTH players via Socket.IO ──
          // Get the io instance attached to the app in server.js
          const io = req.app.get('io');
          if (io) {
            emitBattleResult(io, match.roomCode, {
              result: 'win',
              winner: req.user._id,
              match: finalizedMatch,
            });
          }
          // ──────────────────────────────────────────────────────────────────

          return res.json({
            success: true,
            data: {
              submission,
              verdict: finalVerdict,
              testCasesPassed: passedCount,
              totalTestCases: allTestCases.length,
              battleFinished: true,
              winnerId: req.user._id,
              match: finalizedMatch,
            },
          });
        }
      }
    }

    // Update problemsSolved count if this is first accepted submission
    if (finalVerdict === 'Accepted') {
      const previousAccepted = await Submission.findOne({
        user: req.user._id,
        problem: problemId,
        verdict: 'Accepted',
        _id: { $ne: submission._id },
      });
      if (!previousAccepted) {
        await User.findByIdAndUpdate(req.user._id, { $inc: { problemsSolved: 1 } });
      }
    }

    res.json({
      success: true,
      data: {
        submission,
        verdict: finalVerdict,
        testCasesPassed: passedCount,
        totalTestCases: allTestCases.length,
        battleFinished: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/submissions/history
export const getSubmissionHistory = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};
