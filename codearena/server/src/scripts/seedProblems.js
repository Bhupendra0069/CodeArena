import 'dotenv/config';
import mongoose from 'mongoose';
import Problem from '../models/Problem.js';

const problems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nReturn the answer in any order.',
    difficulty: 'Easy',
    category: 'Array',
    inputFormat: 'First line: n target (size of array and target sum).\nSecond line: n space-separated integers.',
    outputFormat: 'Two space-separated 0-based indices.',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
    examples: [
      { input: '4 9\n2 7 11 15', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9.' },
      { input: '3 6\n3 2 4', output: '1 2', explanation: 'nums[1] + nums[2] = 2 + 4 = 6.' },
    ],
    sampleTestCases: [
      { input: '4 9\n2 7 11 15', expectedOutput: '0 1', isHidden: false },
      { input: '3 6\n3 2 4', expectedOutput: '1 2', isHidden: false },
    ],
    hiddenTestCases: [
      { input: '2 6\n3 3', expectedOutput: '0 1', isHidden: true },
      { input: '5 10\n1 2 3 4 6', expectedOutput: '3 4', isHidden: true },
      { input: '4 0\n-1 0 1 2', expectedOutput: '0 2', isHidden: true },
    ],
    timeLimit: 2000,
    memoryLimit: 256,
  },
  {
    title: 'Palindrome Check',
    description: 'Given a string s, return true if it is a palindrome, or false otherwise.\n\nA string is a palindrome when it reads the same forward and backward.\n\nConsider only alphanumeric characters and ignore cases.',
    difficulty: 'Easy',
    category: 'String',
    inputFormat: 'A single line containing the string s.',
    outputFormat: 'Print "true" if palindrome, "false" otherwise.',
    constraints: '1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.',
    examples: [
      { input: 'A man a plan a canal Panama', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 'race a car', output: 'false', explanation: '"raceacar" is not a palindrome.' },
    ],
    sampleTestCases: [
      { input: 'A man a plan a canal Panama', expectedOutput: 'true', isHidden: false },
      { input: 'race a car', expectedOutput: 'false', isHidden: false },
    ],
    hiddenTestCases: [
      { input: ' ', expectedOutput: 'true', isHidden: true },
      { input: 'Was it a car or a cat I saw', expectedOutput: 'true', isHidden: true },
      { input: 'hello', expectedOutput: 'false', isHidden: true },
      { input: 'No lemon no melon', expectedOutput: 'true', isHidden: true },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
  },
  {
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    inputFormat: 'First line: n (size of array).\nSecond line: n space-separated integers.',
    outputFormat: 'A single integer: the maximum subarray sum.',
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    examples: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: '1\n1', output: '1', explanation: 'Single element is its own subarray.' },
    ],
    sampleTestCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false },
      { input: '1\n1', expectedOutput: '1', isHidden: false },
    ],
    hiddenTestCases: [
      { input: '5\n5 4 -1 7 8', expectedOutput: '23', isHidden: true },
      { input: '3\n-2 -1 -3', expectedOutput: '-1', isHidden: true },
      { input: '6\n1 2 3 -2 5 -8', expectedOutput: '9', isHidden: true },
    ],
    timeLimit: 2000,
    memoryLimit: 256,
  },
  {
    title: 'Valid Parentheses',
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    difficulty: 'Easy',
    category: 'Stack',
    inputFormat: 'A single line containing the string s.',
    outputFormat: 'Print "true" if valid, "false" otherwise.',
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'",
    examples: [
      { input: '()', output: 'true', explanation: 'Simple matching pair.' },
      { input: '()[]{}\n', output: 'true', explanation: 'All pairs match.' },
      { input: '(]', output: 'false', explanation: 'Mismatched bracket types.' },
    ],
    sampleTestCases: [
      { input: '()', expectedOutput: 'true', isHidden: false },
      { input: '(]', expectedOutput: 'false', isHidden: false },
    ],
    hiddenTestCases: [
      { input: '{[]}', expectedOutput: 'true', isHidden: true },
      { input: '([)]', expectedOutput: 'false', isHidden: true },
      { input: '((', expectedOutput: 'false', isHidden: true },
      { input: ']', expectedOutput: 'false', isHidden: true },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
  },
  {
    title: 'Binary Search',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    difficulty: 'Easy',
    category: 'Binary Search',
    inputFormat: 'First line: n target\nSecond line: n space-separated sorted integers.',
    outputFormat: 'The index of target, or -1 if not found.',
    constraints: '1 <= nums.length <= 10^4\n-10^4 <= nums[i], target <= 10^4\nAll integers in nums are unique. nums is sorted in ascending order.',
    examples: [
      { input: '6 9\n-1 0 3 5 9 12', output: '4', explanation: '9 exists at index 4.' },
      { input: '6 2\n-1 0 3 5 9 12', output: '-1', explanation: '2 does not exist.' },
    ],
    sampleTestCases: [
      { input: '6 9\n-1 0 3 5 9 12', expectedOutput: '4', isHidden: false },
      { input: '6 2\n-1 0 3 5 9 12', expectedOutput: '-1', isHidden: false },
    ],
    hiddenTestCases: [
      { input: '1 5\n5', expectedOutput: '0', isHidden: true },
      { input: '5 3\n1 2 3 4 5', expectedOutput: '2', isHidden: true },
      { input: '5 100\n1 2 3 4 5', expectedOutput: '-1', isHidden: true },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
  },
  {
    title: 'Climbing Stairs',
    description: 'You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    inputFormat: 'A single integer n.',
    outputFormat: 'A single integer: the number of distinct ways.',
    constraints: '1 <= n <= 45',
    examples: [
      { input: '2', output: '2', explanation: 'Two ways: (1+1) or (2).' },
      { input: '3', output: '3', explanation: 'Three ways: (1+1+1), (1+2), (2+1).' },
    ],
    sampleTestCases: [
      { input: '2', expectedOutput: '2', isHidden: false },
      { input: '3', expectedOutput: '3', isHidden: false },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: '1', isHidden: true },
      { input: '5', expectedOutput: '8', isHidden: true },
      { input: '10', expectedOutput: '89', isHidden: true },
      { input: '45', expectedOutput: '1836311903', isHidden: true },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
  },
  {
    title: 'Number of Islands',
    description: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    difficulty: 'Medium',
    category: 'Graph',
    inputFormat: 'First line: m n (grid dimensions).\nNext m lines: n space-separated values (0 or 1).',
    outputFormat: 'Single integer: number of islands.',
    constraints: 'm == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is 0 or 1.',
    examples: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', output: '1', explanation: 'All land connected as one island.' },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', output: '3', explanation: 'Three distinct islands.' },
    ],
    sampleTestCases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expectedOutput: '1', isHidden: false },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expectedOutput: '3', isHidden: false },
    ],
    hiddenTestCases: [
      { input: '1 1\n1', expectedOutput: '1', isHidden: true },
      { input: '1 1\n0', expectedOutput: '0', isHidden: true },
      { input: '3 3\n1 0 1\n0 0 0\n1 0 1', expectedOutput: '4', isHidden: true },
    ],
    timeLimit: 2000,
    memoryLimit: 256,
  },
  {
    title: 'Coin Change',
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    inputFormat: 'First line: n amount\nSecond line: n space-separated integers (coin denominations).',
    outputFormat: 'Single integer: fewest coins needed, or -1.',
    constraints: '1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
    examples: [
      { input: '3 11\n1 5 6', output: '2', explanation: '11 = 5 + 6.' },
      { input: '3 3\n2 5 10', output: '-1', explanation: 'Cannot make 3.' },
    ],
    sampleTestCases: [
      { input: '3 11\n1 5 6', expectedOutput: '2', isHidden: false },
      { input: '3 3\n2 5 10', expectedOutput: '-1', isHidden: false },
    ],
    hiddenTestCases: [
      { input: '1 0\n1', expectedOutput: '0', isHidden: true },
      { input: '3 11\n1 2 5', expectedOutput: '3', isHidden: true },
      { input: '2 100\n1 5', expectedOutput: '20', isHidden: true },
    ],
    timeLimit: 2000,
    memoryLimit: 256,
  },
  {
    title: 'Reverse Linked List',
    description: 'Given an array of integers representing a singly linked list, reverse it and print the reversed list.\n\n(For this problem, the linked list is provided as an array for simplicity.)',
    difficulty: 'Easy',
    category: 'Linked List',
    inputFormat: 'First line: n (number of nodes).\nSecond line: n space-separated integers.',
    outputFormat: 'n space-separated integers in reversed order.',
    constraints: '0 <= n <= 5000\n-5000 <= Node.val <= 5000',
    examples: [
      { input: '5\n1 2 3 4 5', output: '5 4 3 2 1', explanation: 'List reversed.' },
      { input: '2\n1 2', output: '2 1', explanation: 'Two elements swapped.' },
    ],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', isHidden: false },
      { input: '2\n1 2', expectedOutput: '2 1', isHidden: false },
    ],
    hiddenTestCases: [
      { input: '1\n1', expectedOutput: '1', isHidden: true },
      { input: '3\n1 2 3', expectedOutput: '3 2 1', isHidden: true },
      { input: '4\n4 3 2 1', expectedOutput: '1 2 3 4', isHidden: true },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
  },
  {
    title: 'Word Search',
    description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    difficulty: 'Hard',
    category: 'Backtracking',
    inputFormat: 'First line: m n (grid dimensions).\nNext m lines: n characters separated by spaces.\nLast line: word to search.',
    outputFormat: 'Print "true" if word exists, "false" otherwise.',
    constraints: 'm == board.length\nn = board[i].length\n1 <= m, n <= 6\n1 <= word.length <= 15\nboard and word consist only of lowercase English letters.',
    examples: [
      {
        input: '4 4\nA B C E\nS F C S\nA D E E\n3\nABCCED',
        output: 'true',
        explanation: 'The word ABCCED exists in the grid.',
      },
      {
        input: '4 4\nA B C E\nS F C S\nA D E E\n4\nSEES',
        output: 'true',
        explanation: 'SEES exists starting from row 1, col 3.',
      },
    ],
    sampleTestCases: [
      {
        input: '4 4\nA B C E\nS F C S\nA D E E\nABCCED',
        expectedOutput: 'true',
        isHidden: false,
      },
    ],
    hiddenTestCases: [
      {
        input: '4 4\nA B C E\nS F C S\nA D E E\nABCB',
        expectedOutput: 'false',
        isHidden: true,
      },
      {
        input: '1 1\nA\nA',
        expectedOutput: 'true',
        isHidden: true,
      },
    ],
    timeLimit: 3000,
    memoryLimit: 256,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Problem.deleteMany({});
    console.log('🗑️  Cleared existing problems');

    const created = await Problem.insertMany(problems);
    console.log(`🌱 Seeded ${created.length} problems successfully`);

    await mongoose.disconnect();
    console.log('✅ Done. Database disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
