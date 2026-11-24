// Judge0 API configuration
export const JUDGE0_CONFIG = {
  apiUrl: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
  apiKey: process.env.JUDGE0_API_KEY || '',
  apiHost: process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com',
};

// Judge0 language IDs
// Full list: https://ce.judge0.com/languages/
export const LANGUAGE_IDS = {
  python: 71,     // Python 3.8.1
  javascript: 63, // JavaScript (Node.js 12.14.0)
  java: 62,       // Java (OpenJDK 13.0.1)
  cpp: 54,        // C++ (GCC 9.2.0)
};
