import mongoose from 'mongoose';

const tpoProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collegeName: { type: String },
}, { timestamps: true });

export default mongoose.model('TPOProfile', tpoProfileSchema);
