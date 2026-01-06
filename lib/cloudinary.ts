import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a base64 image to Cloudinary
 * @param base64Image - Base64 encoded image string
 * @param employeeId - Employee ID for folder organization
 * @param folder - Subfolder (e.g., 'registration' or 'attendance')
 * @returns Cloudinary secure URL
 */
export async function uploadToCloudinary(
    base64Image: string,
    employeeId: string,
    folder: 'registration' | 'attendance'
): Promise<string> {
    try {
        // Validate Cloudinary configuration
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
            throw new Error('Cloudinary cloud name is not configured');
        }
        if (!process.env.CLOUDINARY_API_KEY) {
            throw new Error('Cloudinary API key is not configured');
        }
        if (!process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary API secret is not configured');
        }

        // Validate base64 image
        if (!base64Image || typeof base64Image !== 'string') {
            throw new Error('Invalid image data provided');
        }

        // Remove data URL prefix if present
        const base64Data = base64Image.includes(',') 
            ? base64Image.split(',')[1] 
            : base64Image;

        if (!base64Data || base64Data.length === 0) {
            throw new Error('Empty image data');
        }

        // Prepare upload options
        const uploadOptions: any = {
            folder: `employee-attendance/${employeeId}/${folder}`,
            transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        };

        // Only add upload_preset if it's configured (for unsigned uploads)
        if (process.env.CLOUDINARY_UPLOAD_PRESET) {
            uploadOptions.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET;
        }

        const uploadResponse = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${base64Data}`,
            uploadOptions
        );

        if (!uploadResponse || !uploadResponse.secure_url) {
            throw new Error('Cloudinary upload succeeded but no URL returned');
        }

        return uploadResponse.secure_url;
    } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        
        // Provide more specific error messages
        if (error.message) {
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        }
        
        if (error.http_code) {
            throw new Error(`Cloudinary API error (${error.http_code}): ${error.message || 'Unknown error'}`);
        }
        
        throw new Error('Failed to upload image to Cloudinary. Please check your configuration.');
    }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
}

export default cloudinary;
