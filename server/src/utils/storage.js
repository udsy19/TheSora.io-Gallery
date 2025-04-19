const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// Configure AWS SDK for Backblaze B2
const s3 = new AWS.S3({
  endpoint: config.B2_ENDPOINT,
  accessKeyId: config.B2_APPLICATION_KEY_ID,
  secretAccessKey: config.B2_APPLICATION_KEY,
  s3ForcePathStyle: true, // Needed for Backblaze B2
  signatureVersion: 'v4'
});

// Setup local storage for temporary upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Configure multer for file uploads
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Accept images and videos only
    const filetypes = /jpeg|jpg|png|gif|bmp|webp|mp4|mov|avi|webm/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only image and video files are allowed!'));
  }
});

// Upload file to Backblaze B2
const uploadToB2 = async (file, collection) => {
  try {
    // Check if credentials are configured
    if (!config.B2_APPLICATION_KEY_ID || !config.B2_APPLICATION_KEY) {
      console.log('Backblaze B2 credentials not configured, skipping cloud upload');
      // Return local path for development
      return {
        success: true,
        url: `/uploads/${path.basename(file.path)}`,
        size: file.size,
        mimetype: file.mimetype,
        key: path.basename(file.path)
      };
    }
    
    console.log(`Uploading file to B2: ${file.path}`);
    
    // Directory structure within bucket: collections/{collectionId}/filename
    const key = `collections/${collection}/${path.basename(file.path)}`;
    
    // Read file from local storage
    const fileContent = fs.readFileSync(file.path);
    
    // Upload parameters
    const params = {
      Bucket: config.B2_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: file.mimetype
    };
    
    // Upload to B2
    const data = await s3.upload(params).promise();
    
    // Delete local file after upload
    fs.unlinkSync(file.path);
    
    return {
      success: true,
      url: data.Location,
      size: file.size,
      mimetype: file.mimetype,
      key: data.Key
    };
  } catch (error) {
    console.error('Error uploading to B2:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate a signed URL for downloading a file
const getSignedDownloadUrl = async (key) => {
  try {
    // Check if credentials are configured
    if (!config.B2_APPLICATION_KEY_ID || !config.B2_APPLICATION_KEY) {
      console.log('Backblaze B2 credentials not configured, returning local path');
      return {
        success: true,
        url: `/uploads/${path.basename(key)}`
      };
    }
    
    const params = {
      Bucket: config.B2_BUCKET_NAME,
      Key: key,
      Expires: 3600 // 1 hour expiration
    };
    
    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    
    return {
      success: true,
      url: signedUrl
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete a file from Backblaze B2
const deleteFromB2 = async (key) => {
  try {
    // Check if credentials are configured
    if (!config.B2_APPLICATION_KEY_ID || !config.B2_APPLICATION_KEY) {
      console.log('Backblaze B2 credentials not configured, skipping cloud delete');
      return { success: true };
    }
    
    const params = {
      Bucket: config.B2_BUCKET_NAME,
      Key: key
    };
    
    await s3.deleteObject(params).promise();
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting from B2:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  upload,
  uploadToB2,
  getSignedDownloadUrl,
  deleteFromB2
};