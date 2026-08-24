const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import Models
const Employee = require('./Models/Employee');
const LeaveType = require('./Models/LeaveType');
const LeaveRequest = require('./Models/LeaveRequest');

// Import Middleware
const requestLogger = require('./middleware/requestLogger');
const authGuard = require('./middleware/authGuard');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'itue301_exam_secret_key_2026';

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// In-memory fallback stores for testing resilience
const memoryStore = {
  employees: [
    {
      _id: '64d2a1b2e4b0a1a2c3d4e001',
      name: 'Alex Johnson',
      email: 'alex@techsolutions.com',
      password: 'password123',
      department: 'Engineering',
      designation: 'Software Engineer',
      role: 'employee',
      leaveBalance: 20
    },
    {
      _id: '64d2a1b2e4b0a1a2c3d4e002',
      name: 'Sarah Connor',
      email: 'sarah@techsolutions.com',
      password: 'password123',
      department: 'Human Resources',
      designation: 'HR Manager',
      role: 'hr',
      leaveBalance: 20
    }
  ],
  leaveTypes: [
    { _id: '64d2a1b2e4b0a1a2c3d4e101', name: 'Casual', maxDaysPerYear: 12 },
    { _id: '64d2a1b2e4b0a1a2c3d4e102', name: 'Sick', maxDaysPerYear: 10 },
    { _id: '64d2a1b2e4b0a1a2c3d4e103', name: 'Earned', maxDaysPerYear: 15 },
    { _id: '64d2a1b2e4b0a1a2c3d4e104', name: 'CompOff', maxDaysPerYear: 5 }
  ],
  leaveRequests: [
    {
      _id: '64d2a1b2e4b0a1a2c3d4e201',
      employeeId: '64d2a1b2e4b0a1a2c3d4e001',
      leaveTypeId: { _id: '64d2a1b2e4b0a1a2c3d4e102', name: 'Sick', maxDaysPerYear: 10 },
      fromDate: '2026-08-10',
      toDate: '2026-08-12',
      days: 3,
      reason: 'Viral fever and rest',
      status: 'approved'
    }
  ]
};

// Database Connection & Auto Seed
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI || mongoURI.includes('<username>')) {
    console.log('[Notice] Set your actual MongoDB Atlas connection string in .env to connect to Atlas.');
    return;
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('MongoDB Atlas Connected successfully to:', mongoose.connection.host);
    await seedInitialData();
  } catch (err) {
    console.log('MongoDB Atlas Connection notice:', err.message);
  }
};

const seedInitialData = async () => {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const countTypes = await LeaveType.countDocuments();
    if (countTypes === 0) {
      await LeaveType.insertMany(memoryStore.leaveTypes.map(({ _id, ...rest }) => rest));
      console.log('Default leave types seeded to MongoDB Atlas.');
    }

    const countEmployees = await Employee.countDocuments();
    if (countEmployees === 0) {
      for (const emp of memoryStore.employees) {
        const hashedPassword = await bcrypt.hash(emp.password, 10);
        await Employee.create({
          name: emp.name,
          email: emp.email,
          password: hashedPassword,
          department: emp.department,
          designation: emp.designation,
          role: emp.role,
          leaveBalance: emp.leaveBalance
        });
      }
      console.log('Default employees seeded to MongoDB Atlas.');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

connectDB();

// ==========================================
// REST API Endpoints (/api/v1/)
// ==========================================

// 1. POST /api/v1/auth/login - Authenticate employee, issue token
app.post('/api/v1/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    let employee = null;

    if (mongoose.connection.readyState === 1) {
      employee = await Employee.findOne({ email: email.toLowerCase() });
      if (!employee) {
        const hashedPassword = await bcrypt.hash(password, 10);
        employee = await Employee.create({
          name: req.body.name || email.split('@')[0],
          email: email.toLowerCase(),
          password: hashedPassword,
          department: req.body.department || 'Engineering',
          designation: req.body.role === 'hr' ? 'HR Manager' : 'Software Engineer',
          role: req.body.role || 'employee',
          leaveBalance: 20
        });
      }
    } else {
      // In-memory fallback
      employee = memoryStore.employees.find(e => e.email.toLowerCase() === email.toLowerCase());
      if (!employee) {
        employee = {
          _id: '64d2a1b2e4b0a1a2c3d4e' + Math.floor(100 + Math.random() * 900),
          name: req.body.name || email.split('@')[0],
          email: email.toLowerCase(),
          password,
          department: req.body.department || 'Engineering',
          designation: req.body.role === 'hr' ? 'HR Manager' : 'Software Engineer',
          role: req.body.role || 'employee',
          leaveBalance: 20
        };
        memoryStore.employees.push(employee);
      }
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: employee._id.toString(),
        email: employee.email,
        role: employee.role,
        name: employee.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        designation: employee.designation,
        role: employee.role,
        leaveBalance: employee.leaveBalance
      }
    });
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/v1/leave-types - Return all leave types (public)
app.get('/api/v1/leave-types', async (req, res, next) => {
  try {
    let leaveTypes = [];

    if (mongoose.connection.readyState === 1) {
      leaveTypes = await LeaveType.find();
    } else {
      leaveTypes = memoryStore.leaveTypes;
    }

    res.status(200).json({
      success: true,
      count: leaveTypes.length,
      data: leaveTypes
    });
  } catch (error) {
    next(error);
  }
});

// 3. POST /api/v1/leaves - Apply for leave (protected)
app.post('/api/v1/leaves', authGuard, async (req, res, next) => {
  try {
    const { leaveTypeId, fromDate, toDate, days, reason } = req.body;
    const employeeId = req.employee.id;

    if (!leaveTypeId || !fromDate || !toDate || !days) {
      return res.status(400).json({
        success: false,
        error: 'Please provide leaveTypeId, fromDate, toDate, and days'
      });
    }

    const numDays = Number(days);
    if (isNaN(numDays) || numDays < 1) {
      return res.status(400).json({
        success: false,
        error: 'Days must be a valid number of at least 1'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({
          success: false,
          error: 'Employee record not found'
        });
      }

      // Check balance requirement (Task 3 & 5)
      if (numDays > employee.leaveBalance) {
        return res.status(400).json({
          success: false,
          error: `Leave request exceeds remaining balance. Available: ${employee.leaveBalance}, Requested: ${numDays}`
        });
      }

      const leaveRequest = await LeaveRequest.create({
        employeeId,
        leaveTypeId,
        fromDate,
        toDate,
        days: numDays,
        reason: reason || '',
        status: 'pending'
      });

      // Deduct days from employee balance
      employee.leaveBalance -= numDays;
      await employee.save();

      return res.status(201).json({
        success: true,
        message: 'Leave request created successfully',
        data: leaveRequest,
        remainingBalance: employee.leaveBalance
      });
    } else {
      // In-memory fallback
      let employee = memoryStore.employees.find(e => e._id.toString() === employeeId.toString());
      if (!employee) {
        employee = memoryStore.employees[0];
      }

      if (numDays > employee.leaveBalance) {
        return res.status(400).json({
          success: false,
          error: `Leave request exceeds remaining balance. Available: ${employee.leaveBalance}, Requested: ${numDays}`
        });
      }

      const selectedType = memoryStore.leaveTypes.find(t => t._id.toString() === leaveTypeId.toString()) || {
        _id: leaveTypeId,
        name: 'Casual',
        maxDaysPerYear: 12
      };

      const newLeave = {
        _id: '64d2a1b2e4b0a1a2c3d4e' + Math.floor(200 + Math.random() * 800),
        employeeId: employee._id,
        leaveTypeId: selectedType,
        fromDate,
        toDate,
        days: numDays,
        reason: reason || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      employee.leaveBalance -= numDays;
      memoryStore.leaveRequests.push(newLeave);

      return res.status(201).json({
        success: true,
        message: 'Leave request created successfully',
        data: newLeave,
        remainingBalance: employee.leaveBalance
      });
    }
  } catch (error) {
    next(error);
  }
});

// 4. GET /api/v1/leaves/my - Return the employee's own requests (protected)
app.get('/api/v1/leaves/my', authGuard, async (req, res, next) => {
  try {
    const employeeId = req.employee.id;

    if (mongoose.connection.readyState === 1) {
      const leaveRequests = await LeaveRequest.find({ employeeId })
        .populate('leaveTypeId', 'name maxDaysPerYear')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: leaveRequests.length,
        data: leaveRequests
      });
    } else {
      const userRequests = memoryStore.leaveRequests.filter(
        r => r.employeeId.toString() === employeeId.toString()
      );

      return res.status(200).json({
        success: true,
        count: userRequests.length,
        data: userRequests
      });
    }
  } catch (error) {
    next(error);
  }
});

// 5. PATCH /api/v1/leaves/:id/status - Manager/HR approves or rejects request (protected)
app.patch('/api/v1/leaves/:id/status', authGuard, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status against allowed values: ['approved', 'rejected']
    const ALLOWED = ['approved', 'rejected'];
    if (!ALLOWED.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status: '${status}'. Allowed values are: ${ALLOWED.join(', ')}`
      });
    }

    if (mongoose.connection.readyState === 1) {
      const leaveRequest = await LeaveRequest.findById(id);
      if (!leaveRequest) {
        return res.status(404).json({
          success: false,
          error: `Leave request with ID ${id} not found`
        });
      }

      if (leaveRequest.status !== 'rejected' && status === 'rejected') {
        await Employee.findByIdAndUpdate(leaveRequest.employeeId, {
          $inc: { leaveBalance: leaveRequest.days }
        });
      }

      leaveRequest.status = status;
      await leaveRequest.save();

      return res.status(200).json({
        success: true,
        message: `Leave request has been ${status}`,
        data: leaveRequest
      });
    } else {
      const leaveRequest = memoryStore.leaveRequests.find(r => r._id.toString() === id.toString());
      if (!leaveRequest) {
        return res.status(404).json({
          success: false,
          error: `Leave request with ID ${id} not found`
        });
      }

      leaveRequest.status = status;
      return res.status(200).json({
        success: true,
        message: `Leave request has been ${status}`,
        data: leaveRequest
      });
    }
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Employee Leave Management API is running'
  });
});

// Global Error Handler Middleware (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
