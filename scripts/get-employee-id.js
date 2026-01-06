// Simple script to get the demo employee ID
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://attendanceUser:Pass123@cluster0.ynxdfzh.mongodb.net/employee-attendance?retryWrites=true&w=majority';

async function getEmployeeId() {
    try {
        await mongoose.connect(MONGODB_URI);

        const Employee = mongoose.model('Employee', new mongoose.Schema({
            name: String,
            email: String,
            role: String,
            faceImages: [String],
        }, { timestamps: true }));

        const employee = await Employee.findOne({ email: 'demo@example.com' });

        if (employee) {
            const id = employee._id.toString();
            console.log('EMPLOYEE_ID=' + id);
            console.log('LENGTH=' + id.length);
        } else {
            console.log('NO_EMPLOYEE_FOUND');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('ERROR:', error.message);
        process.exit(1);
    }
}

getEmployeeId();
