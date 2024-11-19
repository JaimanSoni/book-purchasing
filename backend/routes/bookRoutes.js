const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticate = require('../middlewares/authMiddleware');
const { addBook, getBooks, deleteBook, updateBook, deletePhoto , addPhoto} = require('../controllers/bookController');

const upload = multer({ dest: 'uploads/' });

router.post('/add-book', authenticate,upload.array('images'), 
addBook
);
// api/books/all-books
router.get('/all-books', getBooks);

router.put('/book/:id', authenticate, updateBook);

router.delete('/book/:id', authenticate, deleteBook);

router.delete('/delete-photo/:id', authenticate, deletePhoto);

router.post('/add-photo/:id', authenticate, upload.array('images'), addPhoto);


module.exports = router;
