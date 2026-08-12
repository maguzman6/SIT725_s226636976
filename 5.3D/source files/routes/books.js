const express = require('express');
const router = express.Router();

// Import all controllers via index.js
const Controllers = require('../controllers');

router.get('/', Controllers.bookController.getAllBooks);
router.get('/:id', Controllers.bookController.getBookById);
router.post('/', Controllers.bookController.createBook);
router.put('/:id', Controllers.bookController.updateBook);
router.delete('/:id', Controllers.bookController.deleteBook);

module.exports = router;
