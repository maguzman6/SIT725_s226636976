// Import the service
const bookService = require('../services/bookService');

// Controller uses the service to get data
exports.getAllBooks = (req, res) => {
  const items = bookService.getAllBooks();
  if (!items || items.length === 0) {
    return res.status(404).json({
      data: [],
      message: 'Books not found'
    });
  } else {
    res.status(200).json({
      data: items,
      message: 'Books retrieved using service'
    });
  }
};

// Use the service to get a book by ID
exports.getBookById = (req, res) => {
  const items = bookService.getBookById(req.params.id);
  if (!items || items.length === 0 || !items[0]) {
    return res.status(404).json({
      data: [],
      message: 'Book not found'
    });
  } else {
    res.status(200).json({
      data: items,
      message: 'Book retrieved using ID service'
    });
  }
};
