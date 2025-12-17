import mongoose from 'mongoose';

export default async function connectDB(uri) {
  return mongoose.connect(uri, {
    // useNewUrlParser, useUnifiedTopology are default in mongoose 6+
  });
}