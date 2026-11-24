import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' },
});

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
});

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    inputFormat: { type: String, required: true },
    outputFormat: { type: String, required: true },
    constraints: { type: String, required: true },
    examples: [exampleSchema],
    // Hidden test cases — never sent to client (select: false)
    hiddenTestCases: {
      type: [testCaseSchema],
      select: false,
    },
    sampleTestCases: [testCaseSchema],
    timeLimit: { type: Number, default: 2000 },   // milliseconds
    memoryLimit: { type: Number, default: 256 },   // MB
    isActive: { type: Boolean, default: true },
    solvedBy: { type: Number, default: 0 },
  },
  { timestamps: true }
);

problemSchema.index({ difficulty: 1 });
problemSchema.index({ category: 1 });
problemSchema.index({ title: 'text' });

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
