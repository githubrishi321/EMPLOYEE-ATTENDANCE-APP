import mongoose, { Schema, model, models } from 'mongoose';

export interface IEmployee {
    _id: string;
    name: string;
    email: string;
    role: string;
    faceImages: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        role: {
            type: String,
            default: 'Employee',
            trim: true,
        },
        faceImages: {
            type: [String],
            default: [],
            validate: {
                validator: function (v: string[]) {
                    return v.length <= 5;
                },
                message: 'Maximum 5 face images allowed',
            },
        },
    },
    {
        timestamps: true,
    }
);

const Employee = models.Employee || model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
