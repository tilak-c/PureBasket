import mongoose from 'mongoose';
import User from '../models/User.js';

function safeUser(userDoc) {
  if (!userDoc) return null;
  const { _id, name, email, avatarUrl, phone, role, createdAt, updatedAt } = userDoc;
  return { id: _id, name, email, avatarUrl, phone, role, createdAt, updatedAt };
}

export async function getUser(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const user = await User.findById(id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: safeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const { name, avatarUrl, phone } = req.body;
    const update = {};
    if (typeof name === 'string') update.name = name;
    if (typeof avatarUrl === 'string') update.avatarUrl = avatarUrl;
    if (typeof phone === 'string') update.phone = phone;

    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ message: 'Profile updated', user: safeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function listUsers(req, res) {
  try {
    const users = await User.find().lean();
    return res.json({ users: users.map(u => safeUser(u)) });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const user = await User.findByIdAndDelete(id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ message: 'User deleted', user: safeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
