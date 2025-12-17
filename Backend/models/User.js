import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password: { type: String, required: true },

  avatarUrl: { type: String },
  phone: { type: String },
  role: { type: String, enum: ['user','admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
