/**
 * Script to create a demo employee for testing
 * Run this with: node scripts/create-demo-employee.js
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-attendance';

async function createDemoEmployee() {
    const mongoose = await import('mongoose');

    try {
        // Connect to MongoDB
        await mongoose.default.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Define Employee schema (simplified)
        const employeeSchema = new mongoose.Schema({
            name: String,
            email: { type: String, unique: true },
            role: String,
            faceImages: [String],
        }, { timestamps: true });

        const Employee = mongoose.default.models.Employee || mongoose.default.model('Employee', employeeSchema);

        // Check if demo employee already exists
        const existing = await Employee.findOne({ email: 'demo@example.com' });
        if (existing) {
            console.log('\n✅ Demo employee already exists!');
            console.log(`Employee ID: ${existing._id}`);
            console.log(`Name: ${existing.name}`);
            console.log(`Email: ${existing.email}`);
            console.log(`\n📝 Add this to your .env.local file:`);
            console.log(`NEXT_PUBLIC_DEMO_EMPLOYEE_ID=${existing._id}`);
            process.exit(0);
        }

        // Create new demo employee
        const employee = await Employee.create({
            name: 'Demo Employee',
            email: 'demo@example.com',
            role: 'Employee',
            faceImages: [],
        });

        console.log('\n✅ Demo employee created successfully!');
        console.log(`Employee ID: ${employee._id}`);
        console.log(`Name: ${employee.name}`);
        console.log(`Email: ${employee.email}`);
        console.log(`\n📝 Add this to your .env.local file:`);
        console.log(`NEXT_PUBLIC_DEMO_EMPLOYEE_ID=${employee._id}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.default.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    }
}

createDemoEmployee();
