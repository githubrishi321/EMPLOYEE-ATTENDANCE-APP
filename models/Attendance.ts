import mongoose, { Schema, model, models } from 'mongoose';

export interface IAttendance {
    _id: string;
    employeeId: mongoose.Types.ObjectId;
    date: string; // YYYY-MM-DD format
    checkIn: Date;
    checkOut?: Date;
    workingHours: number;
    status: 'Present' | 'Absent' | 'Late';
    attendancePhoto: string;
    createdAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Employee ID is required'],
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
            match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
        },
        checkIn: {
            type: Date,
            required: [true, 'Check-in time is required'],
        },
        checkOut: {
            type: Date,
            default: null,
        },
        workingHours: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late'],
            required: [true, 'Status is required'],
        },
        attendancePhoto: {
            type: String,
            required: [true, 'Attendance photo is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Create compound unique index to prevent duplicate check-ins
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// Create index for faster queries
AttendanceSchema.index({ employeeId: 1 });
AttendanceSchema.index({ date: 1 });

const Attendance = models.Attendance || model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;
