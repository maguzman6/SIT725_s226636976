const express = require('express');
const mongoose = require("mongoose");

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import route file
const bookRoutes = require('./routes/books');

mongoose.connect(`mongodb://${process.env.MONGO_USER || 'root'}:${process.env.MONGO_PASSWORD || 'secretpassword123'}@127.0.0.1:${process.env.MONGO_PORT || '27017'}/${process.env.MONGO_DATABASE || 'coffeeDB'}?authSource=admin`);
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});

// Mount the route at /api/book
app.use('/api/books', bookRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Book List Home Page!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
