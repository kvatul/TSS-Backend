import  { v2 as cloudinary } from "cloudinary";  
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
}) 


const uploadCloudinary = async (localFilePath) => { 
 try {
     if (!localFilePath) return null;
     // upload the file on cloudinary
     const response = await cloudinary.uploader.upload(localFilePath,
         { resource_type: "auto" })
     console.log('file is uploaded on cloudinary',response.url) // response)
     fs.unlinkSync(localFilePath)
     return response
  }
     
 catch (error) {
     console.log("Error occurred during upload file ", error)
     fs.unlinkSync(localFilePath)  // remove locally saved temporary file on our server
     return null
 
 }
}
export {uploadCloudinary}




