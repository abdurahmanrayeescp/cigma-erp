let mongoMemServer = null

export default async () => {
  const configured = process.env.MONGODB_URI || ''

  // Only intercept local/missing URIs, or invalid ones (that cause MongoParseError)
  if (
    configured.includes('127.0.0.1') || 
    configured.includes('localhost') || 
    !configured ||
    (!configured.startsWith('mongodb://') && !configured.startsWith('mongodb+srv://'))
  ) {
    if (!mongoMemServer) {
      console.log('🗄️  Starting in-memory MongoDB...')
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      mongoMemServer = await MongoMemoryServer.create()
    }
    const uri = mongoMemServer.getUri()
    console.log(`✅ In-memory MongoDB running at: ${uri}`)
    process.env.MONGODB_URI = uri
    process.env.IS_MEMORY_DB = 'true'
  }
}

export async function stopMongoMemServer() {
  if (mongoMemServer) {
    await mongoMemServer.stop()
    mongoMemServer = null
  }
}
