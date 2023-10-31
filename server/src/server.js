const express = require('express');
const tagRoutes = require('./routes/tagRoutes');
const fetchEntriesRoutes = require('./routes/fetchEntriesRoutes');

const app = express();
const port = 3000;

// CORS Middleware - TODO configure this more securely in a production environment
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // TODO - remove upon production!
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Use routes
app.use(tagRoutes);
app.use(fetchEntriesRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;