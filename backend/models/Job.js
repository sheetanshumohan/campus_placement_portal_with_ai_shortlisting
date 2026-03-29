import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobType: { type: String, required: true },
  jobCompany: { type: String, required: true },
  role: { type: String, required: true },
  minimumQualifications: { type: String, required: true },
  technicalSkillsRequired: [{ type: String }],
  dateOfPosting: { type: Date, default: Date.now },
  applicationDeadline: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
