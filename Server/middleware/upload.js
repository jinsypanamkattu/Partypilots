const multer = require("multer"); 
const { CloudinaryStorage } = require("multer-storage-cloudinary"); 
const cloudinary = require("../config/cloudinary"); 
// Set up storage engine for multer 
const storage = new CloudinaryStorage({ 
cloudinary: cloudinary, 
params: { 
folder: "partypilot", // Cloudinary folder name 
allowed_formats: ["jpg", "png", "jpeg"], 
transformation: [{ width: 500, height: 500, crop: "limit" }], 
}, 
}); 
const upload = multer({ storage }); 
module.exports = upload;