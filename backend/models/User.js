import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['Student', 'Recruiter', 'TPO'] 
  },
  phoneNo: { type: String },
  nationality: { type: String },
  gender: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
