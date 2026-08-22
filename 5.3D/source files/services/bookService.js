const Book = require('../models/Book');

// Service function to get all book items
const getAllBooks = async () => {
  return await Book.find({}).lean({ getters: true });
};

const getBookById = async (id) => {
  return await Book.find({ id: id }).lean({ getters: true });
};

const createBook = async (bookData) => {
  const { title, author, year, genre, summary, price } = bookData;
  const newBook = new Book(bookData);
  return await newBook.save();
};

const updateBook = async (id, updateData) => {
  if (Object.hasOwn(updateData, 'id')) {
    throw new Error('Cannot update the "id" field');
  }

  const book = await Book.findOneAndUpdate({ id: id }, updateData, { returnDocument: 'after', runValidators: true, strict: 'throw' });
  return book;
};

const deleteBook = async (id) => {
  const book = await Book.findOneAndDelete({ id: id });
  return book;
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};

