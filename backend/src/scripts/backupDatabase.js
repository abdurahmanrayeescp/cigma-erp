import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI
const BACKUP_DIR = path.join(process.cwd(), 'backups')

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

const date = new Date()
const timestamp = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours()}${date.getMinutes()}`
const backupFile = path.join(BACKUP_DIR, `cigma_backup_${timestamp}.archive`)

// Using mongodump to create an archive. 
// Requires MongoDB Database Tools installed on the system where this cron runs.
const command = `mongodump --uri="${MONGODB_URI}" --archive="${backupFile}" --gzip`

console.log(`Starting database backup to ${backupFile}...`)

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup failed: ${error.message}`)
    return
  }
  if (stderr) {
    console.log(`mongodump stderr: ${stderr}`)
  }
  console.log(`✅ Backup successful! Saved to ${backupFile}`)
  
  // Optional: Add logic here to upload `backupFile` to AWS S3 or Google Drive.
})
