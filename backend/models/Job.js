import mongoose from 'mongoose';

const jobSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    type: { type: String, required: true },
    level: { type: String, required: true },
    posted: { type: String, required: true },
    description: { type: String, required: true },
    requirements: {
      skills: [String],
      experience: Number,
    },
    benefits: [String],
    company_image: { type: String }
  },
  {
    timestamps: true,
  }
);

jobSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
