let mongoMemServer = null

// At the beginning of the file: in production, we export a no-op default handler
const isProduction = process.env.NODE_ENV === 'production'

export default isProduction
  ? async () => {}
  : async () => {
      // Remainder of the file only executes in development
      const configured = process.env.MONGODB_URI || ''

      // Only intercept local/missing URIs in development
      if (configured.includes('127.0.0.1') || configured.includes('localhost') || !configured) {
        if (!mongoMemServer) {
          console.log('🗄️  Starting in-memory MongoDB for local development...')
          const { MongoMemoryServer } = await import('mongodb-memory-server')
          mongoMemServer = await MongoMemoryServer.create()
        }
        const uri = mongoMemServer.getUri()
        console.log(`✅ In-memory MongoDB running at: ${uri}`)
        process.env.MONGODB_URI = uri
      }
    }

export async function stopMongoMemServer() {
  if (mongoMemServer) {
    await mongoMemServer.stop()
    mongoMemServer = null
  }
}
