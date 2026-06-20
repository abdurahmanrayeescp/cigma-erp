import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const LOGS_DIR = path.join(__dirname, '..', '..', 'logs')

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true })
}

function rotateLogIfNeeded(filename) {
  const filepath = path.join(LOGS_DIR, filename)
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath)
    if (stats.size > MAX_SIZE) {
      const backupPath = path.join(LOGS_DIR, filename.replace('.log', '.1.log'))
      if (fs.existsSync(backupPath)) {
        try {
          fs.unlinkSync(backupPath)
        } catch (e) {
          // ignore
        }
      }
      try {
        fs.renameSync(filepath, backupPath)
      } catch (e) {
        console.error(`Failed to rotate log file ${filename}:`, e)
      }
    }
  }
}

function writeLog(filename, level, message, error = null, context = {}) {
  try {
    rotateLogIfNeeded(filename)
    const filepath = path.join(LOGS_DIR, filename)
    
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      ...(error && {
        error: error.message,
        stack: error.stack
      }),
      context
    }
    
    fs.appendFileSync(filepath, JSON.stringify(entry) + '\n', 'utf8')
  } catch (err) {
    console.error('Failed to write log:', err)
  }
}

export const logger = {
  info(message, context = {}) {
    console.log(`[INFO] ${message}`, context)
    writeLog('combined.log', 'info', message, null, context)
  },
  warn(message, context = {}) {
    console.warn(`[WARN] ${message}`, context)
    writeLog('combined.log', 'warn', message, null, context)
  },
  error(message, error = null, context = {}) {
    console.error(`[ERROR] ${message}`, error)
    const errObj = error instanceof Error ? error : (error ? new Error(String(error)) : null)
    writeLog('combined.log', 'error', message, errObj, context)
    writeLog('error.log', 'error', message, errObj, context)
  }
}
