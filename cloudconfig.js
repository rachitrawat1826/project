require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Debug log
console.log("[cloudconfig] CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME);
console.log("[cloudconfig] CLOUDINARY_KEY:", process.env.CLOUDINARY_KEY ? "LOADED" : "MISSING");
console.log("[cloudconfig] CLOUDINARY_SECRET:", process.env.CLOUDINARY_SECRET ? "LOADED" : "MISSING");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "wanderluste_DEV",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

module.exports = { cloudinary, storage };