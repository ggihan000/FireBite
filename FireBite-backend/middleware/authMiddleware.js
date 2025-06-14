const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });

    req.user = user; // user.id available in controller
    next();
  });
};


const authenticateUpgrade = (token) => {
  if (!token) {
    return { valid: false, status: 401, message: 'Access denied. No token provided.' };
  }

  try {
    // Synchronous verification (no callback)
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, user };
  } catch (err) {
    return { 
      valid: false, 
      status: 403, 
      message: 'Invalid token.',
      error: err.message
    };
  }
};

module.exports = {authenticateToken,authenticateUpgrade};
