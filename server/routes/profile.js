const express = require('express')
const router = express.Router()
const Profile = require('../models/Profile')
const adminAuth = require('../middleware/adminAuth')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
})
const upload = multer({ storage })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Get profile (single doc)
router.get('/', async (_req, res) => {
  try {
    const p = await Profile.findOne()
    res.json(p || {})
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update profile (admin)
router.put('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, title, bio, imageUrl } = req.body
    const update = { name, title, bio }
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename)
      const up = await cloudinary.uploader.upload(filePath, { folder: 'portfolio-profile' })
      fs.unlink(filePath, () => {})
      update.imageUrl = up.secure_url
    } else if (imageUrl) {
      update.imageUrl = imageUrl
    }
    const p = await Profile.findOneAndUpdate({}, update, { new: true, upsert: true })
    res.json(p)
  } catch (e) {
    res.status(500).json({ error: 'Failed to update profile', details: e?.message })
  }
})

module.exports = router


