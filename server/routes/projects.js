const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const adminAuth = require('../middleware/adminAuth')
const multer = require('multer')
const path = require('path')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

// Multer config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, unique + ext)
  }
})
const upload = multer({ storage })

// Cloudinary config (from env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// List published projects (public)
router.get('/', async (_req, res) => {
  try {
    const projects = await Project.find({ status: 'published' }).sort({ createdAt: -1 })
    res.json({ projects })
  } catch (e) {
    console.error('GET /api/projects failed:', e)
    res.status(500).json({ error: 'Failed to fetch projects', details: e?.message })
  }
})

// Admin list (all statuses)
router.get('/all', adminAuth, async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json({ projects })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch all projects', details: e?.message })
  }
})

// Create project (admin only)
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, tags, link, imageUrl, status } = req.body
    if (!title) return res.status(400).json({ error: 'Title is required' })
    const normalizedTags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [])
    let finalImage = imageUrl
    if (req.file) {
      try {
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename)
        const up = await cloudinary.uploader.upload(filePath, { folder: 'portfolio-projects' })
        finalImage = up.secure_url
        fs.unlink(filePath, () => {})
      } catch (err) {
        console.error('Cloudinary upload failed:', err)
        return res.status(500).json({ error: 'Image upload failed', details: err?.message })
      }
    }
    const project = await Project.create({ title, description, tags: normalizedTags, link, imageUrl: finalImage, status: status === 'published' ? 'published' : 'draft' })
    res.status(201).json(project)
  } catch (e) {
    console.error('POST /api/projects failed:', e)
    res.status(500).json({ error: 'Failed to create project', details: e?.message })
  }
})

// Replace project image (admin only)
router.put('/:id/image', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' })
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename)
    const up = await cloudinary.uploader.upload(filePath, { folder: 'portfolio-projects' })
    fs.unlink(filePath, () => {})
    const project = await Project.findByIdAndUpdate(req.params.id, { imageUrl: up.secure_url }, { new: true })
    if (!project) return res.status(404).json({ error: 'Not found' })
    res.json(project)
  } catch (e) {
    console.error('PUT /api/projects/:id/image failed:', e)
    res.status(500).json({ error: 'Failed to update image', details: e?.message })
  }
})

// Update project
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, description, tags, link, imageUrl, status } = req.body
    const normalizedTags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined)
    const update = {}
    if (title !== undefined) update.title = title
    if (description !== undefined) update.description = description
    if (normalizedTags !== undefined) update.tags = normalizedTags
    if (link !== undefined) update.link = link
    if (imageUrl !== undefined) update.imageUrl = imageUrl
    if (status === 'draft' || status === 'published') update.status = status
    const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!project) return res.status(404).json({ error: 'Not found' })
    res.json(project)
  } catch (e) {
    res.status(500).json({ error: 'Failed to update project', details: e?.message })
  }
})

// Delete project
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Not found' })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete project', details: e?.message })
  }
})

module.exports = router

