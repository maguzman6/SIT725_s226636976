const bookItems = require('../models/book');

// Service function to get all book items
const getAllBooks = async () => {
  return await bookItems.find({}).lean({ getters: true });
};

const getBookById = async (id) => {
  return await bookItems.find({ id: id }).lean({ getters: true });
};

module.exports = {
  getAllBooks,
  getBookById
};
