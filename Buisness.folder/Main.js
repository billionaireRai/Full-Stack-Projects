import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import customers from "./routes/customers.js";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Company', {useNewUrlParser: true,useUnifiedTopology: true,});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/customers', customers);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
