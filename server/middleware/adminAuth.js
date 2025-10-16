module.exports = function adminAuth(req, res, next) {
  const header = req.headers['authorization'] || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : header
  if (!token) return res.status(401).json({ error: 'Missing token' })
  if (token !== process.env.ADMIN_TOKEN) return res.status(403).json({ error: 'Invalid admin token' })
  next()
}


