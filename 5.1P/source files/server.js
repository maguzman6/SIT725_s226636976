const express = require('express');
const app = express();
const PORT = 3000;

// Import route file
const foodRoutes = require('./routes/food');

// Mount the route at /api/book
app.use('/api/book', bookRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Book List Home Page!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
