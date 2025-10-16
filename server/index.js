const express = require('express')
const app = express()
const cors = require('cors')
const  mongoose  = require('mongoose')
const path = require('path')
const fs = require('fs')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
require('dotenv').config()




const PORT = process.env.PORT || 5000
const uri = process.env.URI

mongoose.connect(uri)
.then(() => {
  console.log('Connected to MongoDB')
}   )
.catch((err) => {
  console.log(err)
})

app.get('/' , (req, res) => {
  res.send('Backend is running!')
})
// Serve uploaded images
try { fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true }) } catch {}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.get('/health', async (_req, res) => {
  try {
    const state = mongoose.connection.readyState // 1=connected, 2=connecting
    res.json({ ok: true, mongoState: state })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})
// API routes
app.use('/api/projects', require('./routes/projects'))
app.use('/api/profile', require('./routes/profile'))
app.use('/api/contact', require('./routes/contact'))
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
