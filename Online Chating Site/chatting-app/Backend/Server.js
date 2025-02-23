const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const express = require('express');
const chatRoomRoute = require('./routes/chatRoomRoute.js');
const { errorHandlingMiddleware } = require('./utils/Middlewares.js');

const app = express();
const port = process.env.SERVER_RUNNING_PORT;
const cors_Origin = process.env.CORS_ORIGIN;
const cors_Methods = process.env.CORS_METHODS;

// basic inbuilt middlewares...
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.json());
app.use(cors({ origin: cors_Origin, credentials: true, methods: cors_Methods }));

// API routes file for handling different logics related to a endpoint...
app.use('/api/chatroom', chatRoomRoute);

// Error handling middleware after all the routes...
app.use(errorHandlingMiddleware);

// load SSL certificate and key from the SSL_INFO folder...
const options = {
    key: fs.readFileSync(path.join(__dirname, 'sslCredentials', 'private-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'sslCredentials', 'certificate.pem')),
}

// this line will return a https server instance...
const httpsServer = https.createServer(options, app).listen(port, () => {
    console.log(`Secured Server is running on port ${port}`);
});
