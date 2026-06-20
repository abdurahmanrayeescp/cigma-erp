import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoMemServer = null

/**
 * Starts a temporary in-memory MongoDB for local development
 * when MONGODB_URI is pointing to 127.0.0.1 (no real DB).
 */
export async function getMongoUri() {
  const configured = process.env.MONGODB_URI || ''
  
  // Only intercept local/missing URIs in development
  if (
    process.env.NODE_ENV !== 'production' &&
    (configured.includes('127.0.0.1') || configured.includes('localhost'))
  ) {
    if (!mongoMemServer) {
      console.log('🗄️  Starting in-memory MongoDB for local development...')
      mongoMemServer = await MongoMemoryServer.create()
    }
    const uri = mongoMemServer.getUri()
    console.log(`✅ In-memory MongoDB running at: ${uri}`)
    return uri
  }

  return configured
}

export async function stopMongoMemServer() {
  if (mongoMemServer) {
    await mongoMemServer.stop()
    mongoMemServer = null
  }
}
