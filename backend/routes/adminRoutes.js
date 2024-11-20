const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController'); 
const authenticate = require('../middlewares/authMiddleware');

router.post('/login', adminController.login);
router.get('/logout', authenticate ,adminController.logout)
router.post('/register', authenticate ,adminController.register);
router.get('/all-admin', authenticate ,adminController.getAllAdmin);
router.delete('/delete-admin/:id',authenticate  , adminController.deleteAdmin);
router.get('/orders', authenticate ,adminController.getAllOrders);
router.post('/refresh-token', adminController.refreshAccessToken);


module.exports = router;
