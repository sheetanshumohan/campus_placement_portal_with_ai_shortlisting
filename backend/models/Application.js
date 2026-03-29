import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  },
  aiEvaluation: {
    isGoodCandidate: { type: Boolean },
    reasoning: { type: String },
    lackingSkills: [{ type: String }]
  },
  recruiterMessage: { type: String },
}, { timestamps: true });

// Prevent duplicate applications for the same job
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
