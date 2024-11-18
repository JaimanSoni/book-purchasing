const { body } = require('express-validator');

const validateOrder = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('enrollment_number').trim().notEmpty().withMessage('Enrollment number is required'),
  body('division').trim().notEmpty().withMessage('Division is required'),
  body('college').trim().notEmpty().withMessage('College is required'),
  body('branch').trim().notEmpty().withMessage('Branch is required'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Valid semester is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('books').isArray({ min: 1 }).withMessage('At least one book is required'),
  body('books.*.book_id').isInt().withMessage('Valid book ID is required'),
  body('books.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shipping_details').isObject().withMessage('Shipping details are required'),
  body('shipping_details.address').trim().notEmpty().withMessage('Shipping address is required'),
  body('shipping_details.phone').trim().notEmpty().withMessage('Phone number is required')
];

module.exports = { validateOrder };