// Static Express server
const express = require('express');
const http = require('http');

// Create HTTP server
const app = express();
const server = http.Server(app);

// Server "app" directory
app.use(express.static(`${__dirname}/../app`));

// Server "app" directory
app.use('/modules', express.static(`${__dirname}/../node_modules`));

// Start server
const port = 8000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
