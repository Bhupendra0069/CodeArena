import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      default: null,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['python', 'javascript', 'java', 'cpp'],
      required: true,
    },
    verdict: {
      type: String,
      enum: [
        'Accepted',
        'Wrong Answer',
        'Compilation Error',
        'Runtime Error',
        'Time Limit Exceeded',
        'Memory Limit Exceeded',
        'Internal Error',
        'Pending',
      ],
      default: 'Pending',
    },
    executionTime: { type: Number, default: null }, // ms
    memoryUsed: { type: Number, default: null },     // KB
    output: { type: String, default: '' },
    errorOutput: { type: String, default: '' },
    testCasesPassed: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, problem: 1 });
submissionSchema.index({ match: 1 });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
