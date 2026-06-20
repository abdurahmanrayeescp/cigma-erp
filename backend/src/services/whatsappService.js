/**
 * Mock WhatsApp Service
 * Architecture designed to simulate sending templated WhatsApp messages.
 * In a real-world scenario, this would wrap Twilio API or Meta Cloud API.
 */

export const sendWhatsAppMessage = async (phoneNumber, templateName, variables = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  console.log(`[MOCK WHATSAPP] To: ${phoneNumber}`)
  console.log(`[MOCK WHATSAPP] Template: ${templateName}`)
  console.log(`[MOCK WHATSAPP] Variables:`, variables)

  // In a real system we would verify the delivery status from the webhook payload.
  // We'll mock a successful dispatch here.
  return {
    success: true,
    messageId: `wamid.mock.${Date.now()}`,
    status: 'sent'
  }
}

export const sendBulkWhatsApp = async (phoneNumbersArray, templateName, variables = {}) => {
  if (!phoneNumbersArray || phoneNumbersArray.length === 0) return false

  console.log(`[MOCK BULK WHATSAPP] Dispatching to ${phoneNumbersArray.length} numbers using template: ${templateName}`)
  
  // Mock tracking success and failure
  let successful = 0
  for (const number of phoneNumbersArray) {
    if (number && number.length >= 10) {
      successful++
    }
  }

  return {
    success: true,
    totalAttempted: phoneNumbersArray.length,
    totalDelivered: successful
  }
}
