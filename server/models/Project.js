const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    tags: { type: [String], default: [] },
    link: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Project', projectSchema)


