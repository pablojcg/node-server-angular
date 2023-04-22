const { Router } = require('express');
const { createUser, loginUser, renewToken } = require('../controllers/authController');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

// Crear un nuevo usuario
router.post('/new', [
    check('name', 'El name es obligatorio o no cumple con el formato.').not().isEmpty(),
    check('email', 'El email es obligatorio o no cumple con el formato.').isEmail(),
    check('password', 'El password es obligatorio o no cumple con los caracteres minimos.').isLength({ min: 6 }),
    validateFields
], createUser);

// Login de usuario
router.post('/', [
    check('email', 'El email es obligatorio o no cumple con el formato.').isEmail(),
    check('password', 'El password es obligatorio o no cumple con los caracteres minimos.').isLength({ min: 6 }),
    validateFields
] , loginUser);

// Validar y revalidar Token
router.get('/renew', [
    validateJWT
] , renewToken);



module.exports = router;