import express from "express";
import mongoose from "mongoose";
import Employee from "./models/Employee.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Connect to MongoDB
// output of database is also handled as promises like .then() and .catch()
mongoose.connect("mongodb://localhost:27017/Company", {useNewUrlParser: true,useUnifiedTopology: true,})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Data arrays
const Names = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Ethan",
  "Fiona",
  "George",
  "Hannah",
  "Ian",
  "Julia",
];
const Salaries = [
  50000, 60000, 55000, 70000, 65000, 48000, 72000, 59000, 53000, 75000,
];
const Languages = [
  "Python",
  "JavaScript",
  "Java",
  "C#",
  "C++",
  "Ruby",
  "Swift",
  "Go",
  "PHP",
  "Kotlin",
];
const Cities = [
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Sydney",
  "Berlin",
  "Toronto",
  "Dubai",
  "Singapore",
  "San Francisco",
];
const Posts = [
  "Software Engineer",
  "Data Scientist",
  "Project Manager",
  "Product Manager",
  "UX Designer",
  "Systems Analyst",
  "Network Administrator",
  "Database Administrator",
  "IT Support Specialist",
  "DevOps Engineer",
];

// Route to render the initial page
app.get("/", (req, res) => {
  res.render("DummyDataGenerator", { foo: "Foo" });
});

// Route to generate and store random data....
app.get("/generate", async (req, res) => {
  try {
    // Generate and store random data
    for (let i = 0 ; i < 10 ; i++) {
      const randIndex = Math.floor(Math.random() * 10);
      const employeeData = {
        Name: Names[randIndex],
        Salary: Salaries[randIndex],
        language: Languages[randIndex],
        city: Cities[randIndex],
        Post: Posts[randIndex],
      };

      const employee = new Employee.create(employeeData);
      await employee.save();
      console.log("Employee saved:", employee);
    }

    res.render("DummyDataGenerator", {message: "Dummy data generated successfully!",
    });
  } 
  catch (error) {
    console.error("Error generating dummy data:", error);
    res.render("DummyDataGenerator", {message: "Error generating dummy data.",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
