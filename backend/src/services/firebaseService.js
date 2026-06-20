import admin from 'firebase-admin'

// Initialize Firebase Admin only if credentials are provided in env
// This prevents crashing in dev environments missing real keys
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      })
    })
    console.log('Firebase Admin initialized successfully')
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message)
  }
} else {
  console.log('Firebase Admin mocked: Missing environment credentials')
}

/**
 * Send a push notification to a specific device token
 */
export const sendPushNotification = async (token, title, body, data = {}) => {
  if (!admin.apps.length) {
    console.log(`[MOCK PUSH NOTIFICATION] To: ${token} | Title: ${title} | Body: ${body}`)
    return true
  }

  try {
    const message = {
      notification: { title, body },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK' // Standard for cross-platform PWA/Mobile
      },
      token,
    }
    const response = await admin.messaging().send(message)
    console.log('Successfully sent push message:', response)
    return true
  } catch (error) {
    console.error('Error sending push message:', error)
    return false
  }
}

/**
 * Send a push notification to a topic (e.g. 'ALL', 'PARENTS', 'STUDENTS')
 */
export const sendTopicNotification = async (topic, title, body, data = {}) => {
  if (!admin.apps.length) {
    console.log(`[MOCK TOPIC NOTIFICATION] Topic: ${topic} | Title: ${title} | Body: ${body}`)
    return true
  }

  try {
    const message = {
      notification: { title, body },
      data,
      topic,
    }
    const response = await admin.messaging().send(message)
    console.log(`Successfully sent topic (${topic}) message:`, response)
    return true
  } catch (error) {
    console.error(`Error sending topic (${topic}) message:`, error)
    return false
  }
}
