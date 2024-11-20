const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticate = require('../middlewares/authMiddleware');
const { addBook, getBooks, deleteBook, deletePhoto  , updateBookWithPhoto ,getSingleBook} = require('../controllers/bookController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Temporary folder for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  const upload = multer({ storage });


router.post('/add-book',upload.array('images'),  addBook);
// api/books/all-books
router.get('/all-books', getBooks);

router.get('/book/:id' , getSingleBook);

// router.put('/book/:id', updateBook);

router.delete('/book/:id', deleteBook);

router.delete('/delete-photo/:id', deletePhoto);

// router.post('/add-photo/:id', upload.array('images'), addPhoto);
router.put('/update-book/:id', upload.any(), updateBookWithPhoto);


module.exports = router;
