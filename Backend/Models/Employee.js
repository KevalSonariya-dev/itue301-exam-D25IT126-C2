const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Employee email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  designation: {
    type: String,
    default: 'Software Engineer',
    trim: true
  },
  role: {
    type: String,
    enum: {
      values: ['employee', 'manager', 'hr'],
      message: '{VALUE} is not a valid role'
    },
    default: 'employee'
  },
  leaveBalance: {
    type: Number,
    default: 20,
    min: [0, 'Leave balance cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
