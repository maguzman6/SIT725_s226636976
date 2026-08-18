const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import route file
const bookRoutes = require('./routes/books');
const luckyRoutes = require('./routes/lucky');

// Mount the route at /api/book
app.use('/api/books', bookRoutes);
app.use('/api/lucky', luckyRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Book List Home Page!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
