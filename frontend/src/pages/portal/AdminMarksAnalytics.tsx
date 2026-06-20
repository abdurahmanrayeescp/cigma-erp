import { FileText, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const subjectAverages = [
  { name: 'Mathematics', average: 78 },
  { name: 'Science', average: 82 },
  { name: 'English', average: 75 },
  { name: 'History', average: 88 },
  { name: 'Computer', average: 92 },
]

export default function AdminMarksAnalytics() {
  const handleDownloadMarksheet = () => {
    alert('Downloading PDF Marksheet...')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-maroon-600" />
            Marks & Results Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View school-wide academic performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-8">
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Average Percentage by Subject (Mid-Term)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAverages}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Generate Marksheet (Admin Tool)</h3>
          <div className="flex gap-4 items-end">
             <div className="flex-1">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Admission No</label>
               <input 
                 type="text"
                 placeholder="e.g. A2025001"
                 className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
               />
             </div>
             <div className="flex-1">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam</label>
               <select className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500">
                 <option value="Mid-Term">Mid-Term</option>
                 <option value="Finals">Finals</option>
               </select>
             </div>
             <button 
                onClick={handleDownloadMarksheet}
                className="bg-maroon-600 hover:bg-maroon-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors h-[42px]"
              >
                <Download className="w-4 h-4" /> Generate PDF
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
