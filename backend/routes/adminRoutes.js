const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController'); 
const authenticate = require('../middlewares/authMiddleware');

router.post('/login', adminController.login);

router.post('/register', adminController.register);
router.get('/all-admin', adminController.getAllAdmin);
router.delete('/delete-admin/:id', adminController.deleteAdmin);
router.get('/orders', adminController.getAllOrders);
router.post('/refresh-token', adminController.refreshAccessToken);


module.exports = router;
