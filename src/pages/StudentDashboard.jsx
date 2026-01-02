import React, { useEffect, useState } from 'react';
import { assignmentService } from '../api/assignment.service';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, Send, FileText, Calendar } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssign, setSelectedAssign] = useState(null);
  
  const [answer, setAnswer] = useState('');
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await assignmentService.getPublished();
      setAssignments(data);
    } catch (err) { 
        toast.error("Failed to load assignments");
    } finally { setLoading(false); }
  };

  const selectAssignment = async (assign) => {
    setSelectedAssign(assign);
    setExistingSubmission(null);
    setAnswer('');
    try {
      const sub = await assignmentService.getMySubmission(assign._id || assign.id);
      if (sub) {
        setExistingSubmission(sub);
        setAnswer(sub.answer);
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await assignmentService.submit(selectedAssign._id || selectedAssign.id, answer);
      const sub = await assignmentService.getMySubmission(selectedAssign._id || selectedAssign.id);
      setExistingSubmission(sub);
      setAnswer(sub.answer);
      toast.success("Assignment submitted successfully!");
    } catch (err) { 
        toast.error(err.message || "Failed to submit assignment");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar title="Student Portal" />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-bold text-slate-800">Assignments</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
               {assignments.map(a => (
                   <div key={a._id} onClick={() => selectAssignment(a)} className={`p-4 rounded-lg cursor-pointer border transition ${selectedAssign?._id === a._id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white hover:bg-slate-50 border-transparent'}`}>
                       <h3 className={`font-bold text-sm mb-1 ${selectedAssign?._id === a._id ? 'text-blue-700' : 'text-slate-700'}`}>{a.title}</h3>
                       <div className="flex items-center gap-2 text-xs text-slate-500"><Calendar className="w-3 h-3" /> Due: {new Date(a.dueDate).toLocaleDateString()}</div>
                   </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            {selectedAssign ? (
                <>
                    <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{selectedAssign.title}</h2>
                            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500"><Clock className="w-4 h-4"/> Due: {new Date(selectedAssign.dueDate).toLocaleDateString()}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${existingSubmission ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{existingSubmission ? 'Submitted' : 'Pending'}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="mb-8 bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700">{selectedAssign.description}</div>
                        
                        <h3 className="font-bold text-slate-900 mb-3">Your Work</h3>
                        {existingSubmission ? (
                             <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                                 <div className="flex items-center gap-2 text-green-800 font-bold mb-3"><CheckCircle className="w-5 h-5"/> Submitted</div>
                                 <div className="bg-white p-4 rounded border border-green-100 text-slate-700 whitespace-pre-wrap">{existingSubmission.answer}</div>
                             </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <textarea className="w-full border p-4 rounded-lg h-48 focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4" placeholder="Type answer..." value={answer} onChange={e => setAnswer(e.target.value)} required />
                                <div className="flex justify-end">
                                    <Button type="submit" isLoading={submitting}><Send className="w-4 h-4" /> Submit</Button>
                                </div>
                            </form>
                        )}
                    </div>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <FileText className="w-12 h-12 mb-4 opacity-20" />
                    <p>Select an assignment to view details</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;