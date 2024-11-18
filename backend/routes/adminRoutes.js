const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController'); 
const authenticate = require('../middlewares/authMiddleware');

router.post('/login', adminController.login);

router.post('/register', authenticate, adminController.register);
router.get('/orders', authenticate, adminController.getAllOrders);

module.exports = router;
