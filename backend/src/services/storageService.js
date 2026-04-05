const cloudniary = require("cloudinary").v2;
const fs = require("fs");
cloudniary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImageToCloudinary = async (image) => {
  try {
    if (!image) return null;
    const response = await cloudniary.uploader.upload(image, {
      resource_type: "image",
    });

    fs.unlinkSync(image);

    return response.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    fs.unlinkSync(image);
    return null;
  }
};

module.exports = { uploadImageToCloudinary };
