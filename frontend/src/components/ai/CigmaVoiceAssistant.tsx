import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, X, MessageSquare, Sparkles, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { attendanceApi, homeworkApi, marksApi, timetableApi } from '@/lib/api'
import { handleVoiceCommand } from '@/utils/voiceCommands'
import toast from 'react-hot-toast'

// Web Speech API Types
type SpeechRecognitionEvent = any;
type SpeechRecognitionType = any;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionType;
    webkitSpeechRecognition?: SpeechRecognitionType;
  }
}

export default function CigmaVoiceAssistant() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    synthRef.current = window.speechSynthesis

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setErrorMsg('Web Speech API is not supported in this browser. Please use Google Chrome or Microsoft Edge.')
      return
    }

    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'

    rec.onstart = () => {
      setIsListening(true)
      setTranscript('Listening...')
      setResponse('')
      setErrorMsg(null)
    }

    rec.onerror = (e: any) => {
      console.error('Speech recognition error:', e)
      setIsListening(false)
      if (e.error === 'not-allowed') {
        setErrorMsg('Microphone access denied. Please update your permissions.')
      } else {
        setErrorMsg(`Error in speech recognition: ${e.error}`)
      }
    }

    rec.onend = () => {
      setIsListening(false)
    }

    rec.onresult = async (event: SpeechRecognitionEvent) => {
      const resultText = event.results[0][0].transcript
      setTranscript(resultText)
      await processCommand(resultText)
    }

    recognitionRef.current = rec

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Voice Recognition is not supported or initialized.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      setIsSpeaking(false)
      setIsOpen(true)
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('Failed to start speech recognition:', err)
      }
    }
  }

  const speak = (text: string) => {
    if (!synthRef.current || !isSpeechEnabled) return

    synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    synthRef.current.speak(utterance)
  }

  const processCommand = async (commandText: string) => {
    if (!user) return

    const parsed = handleVoiceCommand(commandText, user.role)

    if (parsed.action === 'route' && parsed.route) {
      setResponse(parsed.speakText)
      speak(parsed.speakText)
      setTimeout(() => {
        navigate(parsed.route!)
        setIsOpen(false)
      }, 1500)
      return
    }

    if (parsed.action === 'query' && parsed.queryType) {
      try {
        setResponse('Retrieving live information...')
        let reply = ''
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const currentDay = days[new Date().getDay()]

        if (parsed.queryType === 'attendance') {
          let sId = user.referenceId
          let name = 'your'
          if (user.role === 'PARENT') {
            const child = user.referenceData?.children?.[0]
            if (child) {
              sId = child._id
              name = `${child.name}'s`
            }
          }

          if (!sId) {
            reply = 'No linked student record found for this profile.'
          } else {
            const res = await attendanceApi.getStudentAttendance(sId)
            if (res.success && res.data) {
              const rate = res.data.summary?.percentage ?? 0
              reply = `According to the live database, ${name} overall attendance is ${rate}%.`
            } else {
              reply = 'Could not fetch attendance records at the moment.'
            }
          }
        } else if (parsed.queryType === 'homework') {
          let classId = user.referenceData?.classId
          let name = 'you have'
          if (user.role === 'PARENT') {
            const child = user.referenceData?.children?.[0]
            if (child) {
              classId = child.classId
              name = `${child.name} has`
            }
          }

          if (!classId) {
            reply = 'No classroom link found to look up homework assignments.'
          } else {
            const res = await homeworkApi.getClassHomework(classId)
            if (res.success && res.data) {
              const count = res.data.length
              reply = count === 0
                ? `Excellent! There are no pending homework assignments assigned to the class.`
                : `Currently, ${name} ${count} homework assignment${count > 1 ? 's' : ''} listed.`
            } else {
              reply = 'Could not load homework records.'
            }
          }
        } else if (parsed.queryType === 'marks') {
          let sId = user.referenceId
          let name = 'your'
          if (user.role === 'PARENT') {
            const child = user.referenceData?.children?.[0]
            if (child) {
              sId = child._id
              name = `${child.name}'s`
            }
          }

          if (!sId) {
            reply = 'Could not find a student profile linked to this account.'
          } else {
            const res = await marksApi.getStudentMarks(sId)
            if (res.success && res.data && res.data.length > 0) {
              const totalMax = res.data.reduce((a: number, m: any) => a + m.maxMarks, 0)
              const totalObtained = res.data.reduce((a: number, m: any) => a + m.marksObtained, 0)
              const avg = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '0'
              reply = `Based on the latest exam sheets, ${name} average marks are ${avg}%.`
            } else {
              reply = `There are no marks sheets published in the database yet.`
            }
          }
        } else if (parsed.queryType === 'timetable') {
          if (user.role === 'TEACHER') {
            const res = await timetableApi.getTeacherTimetable('me')
            if (res.success && res.data) {
              const todayList = res.data.filter((t: any) => t.day.toLowerCase() === currentDay.toLowerCase())
              if (todayList.length === 0) {
                reply = `You have no periods scheduled on the timetable for today, ${currentDay}.`
              } else {
                const periods = todayList.map((p: any) => `${p.subject} for class ${p.class?.className || 'N/A'} at ${p.startTime}`).join(', ')
                reply = `Your timetable for today, ${currentDay}, is: ${periods}.`
              }
            } else {
              reply = 'Failed to fetch your teacher timetable.'
            }
          } else {
            let classId = user.referenceData?.classId
            let name = 'you have'
            if (user.role === 'PARENT') {
              const child = user.referenceData?.children?.[0]
              if (child) {
                classId = child.classId
                name = `${child.name} has`
              }
            }

            if (!classId) {
              reply = 'No classroom identifier linked to this student profile.'
            } else {
              const res = await timetableApi.getClassTimetable(classId)
              if (res.success && res.data) {
                const todayList = res.data.filter((t: any) => t.day.toLowerCase() === currentDay.toLowerCase())
                if (todayList.length === 0) {
                  reply = `There are no periods scheduled today, ${currentDay}. Enjoy your break!`
                } else {
                  const periods = todayList.map((p: any) => `${p.subject} at ${p.startTime}`).join(', ')
                  reply = `Today, ${currentDay}, ${name}: ${periods}.`
                }
              } else {
                reply = 'Failed to pull timetable schedules.'
              }
            }
          }
        }

        setResponse(reply)
        speak(reply)
      } catch (err) {
        console.error('Error loading live details:', err)
        setResponse('An error occurred while loading details from the live database.')
        speak('An error occurred while fetching live metrics.')
      }
      return
    }

    // Default unknown command feedback
    setResponse(parsed.speakText)
    speak(parsed.speakText)
  }

  const handleClose = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    setIsSpeaking(false)
    setIsOpen(false)
    setTranscript('')
    setResponse('')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-80 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col gap-4 text-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="bg-maroon-100 dark:bg-maroon-500/10 p-1.5 rounded-lg text-maroon-600 dark:text-maroon-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">CIGMA AI Assistant</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  title={isSpeechEnabled ? 'Mute Speech' : 'Unmute Speech'}
                >
                  {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-500" />}
                </button>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex gap-2 items-start p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold leading-normal">{errorMsg}</span>
              </div>
            )}

            {/* Micro-animations / Speak Bubble */}
            <div className="flex flex-col gap-3 min-h-[90px] justify-center bg-gray-50 dark:bg-navy-950/50 p-4 rounded-xl border border-gray-100/50 dark:border-white/5">
              {transcript && (
                <div className="flex gap-2 items-start">
                  <MessageSquare className="w-4 h-4 text-maroon-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">You said:</span>
                    <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{transcript}</p>
                  </div>
                </div>
              )}

              {response && (
                <div className="flex gap-2 items-start border-t border-gray-100 dark:border-white/5 pt-2 mt-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Assistant:</span>
                    <p className="text-gray-850 dark:text-gray-150 font-bold leading-relaxed">{response}</p>
                  </div>
                </div>
              )}

              {!transcript && !response && (
                <div className="text-center py-4 text-gray-400 dark:text-gray-500 font-medium text-xs flex flex-col items-center gap-1">
                  <Mic className="w-6 h-6 text-gray-300 dark:text-gray-600 mb-1" />
                  Say "show my attendance" or "timetable today"
                </div>
              )}
            </div>

            {/* Guidelines info */}
            <div className="text-[10px] text-gray-400 dark:text-gray-500">
              * Active microphone. RBAC permissions apply to all queried actions.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing microphone floating action button */}
      <button
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white transition-all focus:outline-none focus:ring-4 focus:ring-maroon-500/30 relative overflow-hidden group
          ${isListening 
            ? 'bg-gradient-to-tr from-red-600 to-amber-600 scale-110' 
            : isSpeaking 
              ? 'bg-gradient-to-tr from-amber-500 to-maroon-600' 
              : 'bg-gradient-to-tr from-maroon-700 to-maroon-500 hover:scale-105'
          }`}
      >
        {isListening && (
          <span className="absolute inset-0 rounded-full bg-white/25 animate-ping" />
        )}
        {isListening ? (
          <Mic className="w-6 h-6 animate-bounce" />
        ) : (
          <Mic className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        )}
      </button>
    </div>
  )
}
