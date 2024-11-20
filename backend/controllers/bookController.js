const cloudinary = require("../config/cloudinaryConfig");
const Book = require("../models/Book");
const fs = require('fs');
const addBook = async (req, res) => {
  try {
    const { title, price, stock } = req.body;

    if (!title || !price || !stock) {
      return res
        .status(400)
        .json({ message: "Please provide title, price, and stock." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please provide image files." });
    }
    const images = [];

    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        images.push({ url: result.secure_url, public_id: result.public_id });
      }
    }

    console.log("All uploaded image URLs:", images);

    const newBook = await Book.create({
      title,
      price: parseInt(price),
      stock: parseInt(stock),
      image_url: images, 
    });

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("Error in addBook:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding book",
      error: error.message,
    });
  }
};
const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    

    const processedBooks = books.map(book => {
      const imageUrl = JSON.parse(book.image_url)?.[0]?.url || null; 
      return {
        ...book.toJSON(), 
        image_url: imageUrl, 
      };
    });

    return res.status(200).json({
      success: true,
      books: processedBooks,
    });
  } catch (error) {
    console.error("Error in getBooks:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching books",
      error: error.message,
    });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const imageUrl = JSON.parse(book.image_url)?.[0]?.url || null; 
    const processedBook = {
      ...book.toJSON(),
      image_url: imageUrl, 
    };

    return res.status(200).json({
      success: true,
      book: processedBook,
    });
  } catch (error) {
    console.error("Error in getSingleBook:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching book",
      error: error.message,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params; 

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    await book.destroy();

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteBook:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting book",
      error: error.message,
    });
  }
};
const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params; 

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const imageUrlArray = JSON.parse(book.image_url); 

    if (!imageUrlArray || imageUrlArray.length === 0) {
      return res.status(400).json({ message: "No image to delete" });
    }

    const public_id = imageUrlArray[0].public_id;

    await cloudinary.uploader.destroy(public_id);

    book.image_url = "[]"; 
    await book.save();

    return res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
      book,
    });
  } catch (error) {
    console.error("Error in deletePhoto:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting photo",
      error: error.message,
    });
  }
};
const updateBookWithPhoto = async (req, res) => {
  try {
    const { id } = req.params; 
    const { title, price, stock } = req.body;

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    book.title = title || book.title;
    book.price = price || book.price;
    if (stock !== undefined) book.stock = stock;

    if (req.files && req.files.length > 0) {
      const file = req.files[0];

      const uploadResponse = await cloudinary.uploader.upload(file.path, {
        folder: "books/",
        use_filename: true,
        unique_filename: true,
      });

      const newImage = {
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      };

      book.image_url = [newImage];

      if (file.path) {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting temporary file:", err);
        });
      }
    }

    await book.update({
      image_url: book.image_url, 
      title: book.title,
      price: book.price,
      stock: book.stock,
      updated_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
      image: req.files && req.files.length > 0 ? book.image_url : undefined,
    });
  } catch (error) {
    console.error("Error in updateBookWithPhoto:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating book",
      error: error.message,
    });
  }
};

module.exports = {
  addBook,
  getBooks,
  deleteBook,
  updateBookWithPhoto,
  deletePhoto,
  getSingleBook
};
