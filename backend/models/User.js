import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    skills: [String],
    experience: {
      type: Number,
      default: 0,
    },
    savedJobs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    }],
    applications: [{
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
      status: { type: String, default: 'pending' },
      appliedDate: { type: Date, default: Date.now }
    }],
    completedTests: [String],
    role: {
      type: String,
      enum: ['candidate', 'recruiter'],
      default: 'candidate'
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
