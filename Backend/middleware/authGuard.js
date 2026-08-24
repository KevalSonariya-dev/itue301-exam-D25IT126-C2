const jwt = require('jsonwebtoken');
const Employee = require('../Models/Employee');

const JWT_SECRET = process.env.JWT_SECRET || 'itue301_exam_secret_key_2026';

const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or invalid Authorization Bearer header'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: No token provided'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or expired token'
      });
    }

    // Attach decoded user info to request
    req.employee = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Authentication failed'
    });
  }
};

module.exports = authGuard;
