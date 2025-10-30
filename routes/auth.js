const express = require('express');
const AuthController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Registrar conta
router.post('/register', registerValidation, AuthController.register);

// Login
router.post('/login', loginValidation, AuthController.login);

// Atualizar perfil do usuário logado
router.put('/perfil', authenticateToken, AuthController.atualizarPerfil);

// Login social
router.post('/social-login', AuthController.socialLogin);

module.exports = router;
