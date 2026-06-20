import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const foldersToCreate = [
  'cigma/gallery',
  'cigma/news',
  'cigma/downloads',
  'cigma/principal',
  'cigma/founder',
  'cigma/certificates',
  'cigma/marksheets',
  'cigma/payslips',
  'cigma/teachers',
  'cigma/students'
]

async function initializeCloudinaryFolders() {
  console.log('Initializing Cloudinary Folder Structure...')
  
  if (!process.env.CLOUDINARY_API_KEY) {
    console.error('Error: Cloudinary environment variables are missing in .env')
    process.exit(1)
  }

  for (const folder of foldersToCreate) {
    try {
      await cloudinary.api.create_folder(folder)
      console.log(`✅ Created or verified folder: ${folder}`)
    } catch (error) {
      if (error.message && error.message.includes('already exists')) {
        console.log(`✅ Folder already exists: ${folder}`)
      } else {
        console.error(`❌ Failed to create folder ${folder}:`, error.message)
      }
    }
  }

  console.log('Cloudinary Initialization Complete.')
}

initializeCloudinaryFolders()
