function requireApiKey(req, res, next) {
  const key = req.header('x-api-key');
  if (key !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
}

module.exports = requireApiKey;
