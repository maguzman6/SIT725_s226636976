// Import the service
const bookService = require('../services/bookService');

// Controller uses the service to get data
exports.getAllBooks = (req, res) => {
  const items = bookService.getAllBooks();
  res.json({
    status: 200,
    data: items,
    message: 'Books retrieved using service'
  });
};

// Use the service to get a book by ID
exports.getBookById = (req, res) => {
  const items = bookService.getBookById(req.params.id);
  res.json({
    status: 200,
    data: items,
    message: 'Book retrieved using ID service'
  });
};

