import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Salary: { type: Number, required: true },
  language: { type: String, required: true },
  city: { type: String, required: true },
  Post: { type: String, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
