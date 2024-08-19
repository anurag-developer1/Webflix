const cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadCloudinary(localfilepath) {
    if (!localfilepath) return null;

    try {
        const uploadResult = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto',
        });

        // Delete the local file after successful upload
        fs.unlinkSync(localfilepath);

        // Create optimized and auto-cropped URLs
        const optimizeUrl = cloudinary.url(uploadResult.public_id, {
            fetch_format: 'auto',
            quality: 'auto'
        });

        const autoCropUrl = cloudinary.url(uploadResult.public_id, {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });

        return {
            originalUrl: uploadResult.secure_url,
            optimizedUrl: optimizeUrl,
            croppedUrl: autoCropUrl
        };
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        fs.unlinkSync(localfilepath);
        return null;
    }
}

module.exports = uploadCloudinary;