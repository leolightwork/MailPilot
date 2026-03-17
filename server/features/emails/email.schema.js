import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    trim: true,
    // unique: true,
    lowercase: true,
  },
  // user: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   unique: true,
  // },
  // password: {
  //   type: String,
  //   required: true,
  //   minLength: 6,
  // },
  course: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  repeat: Number,
});

// customerSchema.pre('save', async function (next) {
//   if (!this.isModified(password)) return next();
// });

export default mongoose.model('Customer', customerSchema);
