import mongoose from 'mongoose';

const recruiterProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobRole: { type: String },
  companyWorking: { type: String },
  linkedinUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('RecruiterProfile', recruiterProfileSchema);
