const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para páginas web (redireciona para login se não autenticado)
const webAuthMiddleware = (req, res, next) => {
  let token = null;
  
  // Try multiple sources for token
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '');
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.query.token) {
    token = req.query.token;
  }
  
  if (!token) {
    console.log('No token found, redirecting to login');
    return res.redirect('/login');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('User authenticated:', decoded.email, decoded.tipo);
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    res.clearCookie('token');
    res.redirect('/login');
  }
};

module.exports = { authMiddleware, webAuthMiddleware };