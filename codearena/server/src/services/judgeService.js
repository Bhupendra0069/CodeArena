import axios from 'axios';
import { JUDGE0_CONFIG, LANGUAGE_IDS } from '../config/judge0.js';

/**
 * Submits code to Judge0 and polls for the result.
 * @param {string} sourceCode - The user's source code
 * @param {string} language   - Language key: python | javascript | java | cpp
 * @param {string} stdin      - Standard input for the program
 * @param {number} timeLimit  - Time limit in seconds (default 2)
 * @param {number} memoryLimit - Memory limit in KB (default 256000)
 */
export const executeCode = async (
  sourceCode,
  language,
  stdin = '',
  timeLimit = 2,
  memoryLimit = 256000
) => {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  if (!JUDGE0_CONFIG.apiKey) {
    // Return a mock result if no API key is configured
    return {
      verdict: 'Internal Error',
      output: '',
      errorOutput: 'Judge0 API key not configured. Please add JUDGE0_API_KEY to your .env file.',
      time: null,
      memory: null,
    };
  }

  const payload = {
    source_code: Buffer.from(sourceCode).toString('base64'),
    language_id: languageId,
    stdin: Buffer.from(stdin).toString('base64'),
    cpu_time_limit: timeLimit,
    memory_limit: memoryLimit,
    base64_encoded: true,
    wait: false,
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': JUDGE0_CONFIG.apiKey,
    'X-RapidAPI-Host': JUDGE0_CONFIG.apiHost,
  };

  // Submit the code
  const submitResponse = await axios.post(
    `${JUDGE0_CONFIG.apiUrl}/submissions`,
    payload,
    { headers, params: { base64_encoded: true } }
  );

  const { token } = submitResponse.data;

  // Poll for result (max 15 attempts, 1 second apart)
  for (let attempt = 0; attempt < 15; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const resultResponse = await axios.get(
      `${JUDGE0_CONFIG.apiUrl}/submissions/${token}`,
      {
        headers,
        params: {
          base64_encoded: true,
          fields: 'token,status,stdout,stderr,compile_output,time,memory,status_id',
        },
      }
    );

    const result = resultResponse.data;

    // Status IDs: 1=In Queue, 2=Processing, 3+=Done
    if (result.status.id > 2) {
      return parseJudge0Result(result);
    }
  }

  return {
    verdict: 'Internal Error',
    output: '',
    errorOutput: 'Execution timed out waiting for Judge0 response',
    time: null,
    memory: null,
  };
};

/**
 * Maps a Judge0 result to our internal verdict format.
 */
const parseJudge0Result = (result) => {
  const decode = (str) => (str ? Buffer.from(str, 'base64').toString('utf-8') : '');

  const stdout = decode(result.stdout);
  const stderr = decode(result.stderr);
  const compileOutput = decode(result.compile_output);

  // Judge0 status IDs -> our verdicts
  const statusMap = {
    3: 'Accepted',
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Compilation Error',
    7: 'Runtime Error',
    8: 'Runtime Error',
    9: 'Runtime Error',
    10: 'Runtime Error',
    11: 'Runtime Error',
    12: 'Memory Limit Exceeded',
    13: 'Internal Error',
    14: 'Internal Error',
  };

  const verdict = statusMap[result.status.id] || 'Runtime Error';

  return {
    verdict,
    output: stdout,
    errorOutput: compileOutput || stderr,
    time: result.time ? Math.round(parseFloat(result.time) * 1000) : null,
    memory: result.memory || null,
  };
};
