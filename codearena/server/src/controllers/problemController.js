import Problem from '../models/Problem.js';

// GET /api/problems
export const getProblems = async (req, res, next) => {
  try {
    const { difficulty, search, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const problems = await Problem.find(query)
      .select('-hiddenTestCases -sampleTestCases')
      .sort({ difficulty: 1, createdAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Problem.countDocuments(query);

    res.json({
      success: true,
      data: problems,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/problems/:id
export const getProblemById = async (req, res, next) => {
  try {
    // Select sampleTestCases but NOT hiddenTestCases
    const problem = await Problem.findById(req.params.id).select('-hiddenTestCases');
    if (!problem || !problem.isActive) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }
    res.json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

// POST /api/problems
export const createProblem = async (req, res, next) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};
