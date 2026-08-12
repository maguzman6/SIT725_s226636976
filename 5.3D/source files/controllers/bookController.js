// Import the service
const bookService = require('../services/bookService');

// Controller uses the service to get data
exports.getAllBooks = async (req, res) => {
  try {
    const items = await bookService.getAllBooks();
    res.json({
      data: items,
      message: 'Books retrieved using service'
    });
  }
  catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }

};

// Use the service to get a book by ID
exports.getBookById = async (req, res) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({
        message: 'Book ID is required',
      });
    }

    const items = await bookService.getBookById(_id);
    if (!items || items.length === 0) {
      return res.status(404).json({
        message: `Book with ID ${_id} not found`,
      });
    }

    res.json({
      data: items,
      message: 'Book retrieved using ID service'
    });
  }
  catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }

};

// Use the service to create a new book
exports.createBook = async (req, res) => {
  try {
    const createdBook = await bookService.createBook(req.body);
    return res.status(201).json({
      data: createdBook,
      message: 'Book created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Conflict: Book with ID '${req.body?.id}' already exists`,
      });
    }
    return res.status(400).json({
      message: error.message
    });
  }
};

// Use the service to update an existing book
exports.updateBook = async (req, res) => {
  try {
    const result = await bookService.updateBook(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({
        message: `Book with ID ${req.params.id} not found`,
      });
    }
    return res.status(200).json(
      {
        data: result,
        message: 'Book updated successfully'
      }
    );
  }
  catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await bookService.getBookById(id);
    if (!items || items.length === 0) {
      return res.status(404).json({
        message: `Book with ID ${id} not found`,
      });
    }
    await bookService.deleteBook(id);
    return res.status(200).json({
      message: `Book with ID ${id} deleted successfully`,
    });
  }
  catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

