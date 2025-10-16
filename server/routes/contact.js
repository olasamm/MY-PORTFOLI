const express = require('express')
const router = express.Router()
const Contact = require('../models/Contact')
const adminAuth = require('../middleware/adminAuth')

// Public submit
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required' })
    const saved = await Contact.create({ name, email, message })
    res.status(201).json({ ok: true, id: saved._id })
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit' })
  }
})

// Admin list
router.get('/', adminAuth, async (_req, res) => {
  try {
    const items = await Contact.find().sort({ createdAt: -1 })
    res.json({ items })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Admin mark read
router.put('/:id/read', adminAuth, async (req, res) => {
  try {
    const item = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (e) {
    res.status(500).json({ error: 'Failed to update' })
  }
})

module.exports = router


