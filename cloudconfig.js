// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// console.log(process.env);

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET,
// })

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'wanderluste_DEV',
//         allowedFormats: ["png", "jpg", "jpeg"]
//     },
// });

// module.exports = {
//     cloudinary,
//     storage,
// }

// cloudconfig.js
// cloudconfig.js
// const cloudinary = require('cloudinary').v2; // <-- v2 is important
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY || process.env.CLOUDINARY_KEY,
//     api_secret: process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_SECRET,
// });

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: 'wanderluste_DEV',
//         allowedFormats: ['jpg', 'jpeg', 'png']
//     }
// });

// module.exports = { cloudinary, storage };

// cloudconfig.js
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