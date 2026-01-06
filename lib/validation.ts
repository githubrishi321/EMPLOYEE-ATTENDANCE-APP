import mongoose from 'mongoose';

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id - The string to validate
 * @returns true if valid ObjectId format, false otherwise
 */
export function isValidObjectId(id: string | undefined | null): boolean {
    if (!id) return false;
    return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Validates ObjectId and returns appropriate error response data
 * @param id - The ObjectId to validate
 * @param fieldName - Name of the field for error message
 * @returns null if valid, error object if invalid
 */
export function validateObjectId(id: string | undefined | null, fieldName: string = 'ID') {
    if (!id) {
        return {
            success: false,
            error: `${fieldName} is required`,
        };
    }

    if (!isValidObjectId(id)) {
        return {
            success: false,
            error: `Invalid ${fieldName} format. Must be a valid MongoDB ObjectId (24-character hexadecimal string)`,
        };
    }

    return null;
}
