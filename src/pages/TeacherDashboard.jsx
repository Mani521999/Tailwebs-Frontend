import React, { useEffect, useState } from 'react';
import { assignmentService } from '../api/assignment.service';
import { Plus, Calendar, Trash2, Upload, CheckCircle, Eye } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Modal from '../components/common/Modal';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { STATUS } from '../utils/constants';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; // Import SweetAlert2

const TeacherDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  
  const [modalType, setModalType] = useState(null); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await assignmentService.getTeacherAssignments();
      setAssignments(data);
    } catch (err) { 
        toast.error("Failed to load assignments");
    } finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'edit') await assignmentService.update(selectedItem._id || selectedItem.id, form);
      else await assignmentService.create(form);
      toast.success(`Assignment ${modalType === 'edit' ? 'updated' : 'created'} successfully!`);
      setModalType(null);
      loadData();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6', // Tailwind blue-600
      cancelButtonColor: '#ef4444',  // Tailwind red-500
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
        cancelButton: 'px-4 py-2 rounded-lg font-medium'
      }
    });

    if (result.isConfirmed) {
      try {
        await assignmentService.delete(id);
        toast.success("Assignment deleted successfully");
        loadData();
      } catch (err) { 
        toast.error(err.message); 
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await assignmentService.updateStatus(id, status);
      toast.info(`Assignment status updated to ${status}`);
      loadData();
    } catch (err) { toast.error(err.message); }
  };

  const openView = async (item) => {
    setSelectedItem(item);
    setModalType('view');
    setSubmissions([]);
    try {
      const data = await assignmentService.getSubmissions(item._id);
      setSubmissions(data);
    } catch (err) { toast.error("Failed to fetch submissions"); }
  };

  const filteredList = assignments.filter(a => filter === 'ALL' ? true : a.status === filter);

  const getStatusBadge = (status) => {
    const styles = {
      [STATUS.PUBLISHED]: 'bg-green-100 text-green-700',
      [STATUS.DRAFT]: 'bg-yellow-50 text-yellow-700',
      [STATUS.COMPLETED]: 'bg-slate-100 text-slate-600',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Teacher Portal" />
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex gap-1">
            {['ALL', ...Object.values(STATUS)].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  filter === status ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <Button onClick={() => { setForm({ title: '', description: '', dueDate: '' }); setModalType('create'); }}>
            <Plus className="w-5 h-5" /> New Assignment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && filteredList.map(assign => (
                <div key={assign._id || assign.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col p-5">
                    <div className="flex justify-between items-start mb-3">
                        {getStatusBadge(assign.status)}
                        <span className="flex items-center text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(assign.dueDate).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{assign.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">{assign.description}</p>
                    
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex gap-2">
                           {assign.status === STATUS.DRAFT ? (
                               <button onClick={() => { handleDelete(assign._id || assign.id) }} className="p-2 text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                           ) : (
                                <button onClick={() => openView(assign)} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"><Eye className="w-4 h-4" /> View</button>
                           )}
                        </div>
                        <div>
                            {assign.status === STATUS.DRAFT && <button onClick={() => handleStatusChange(assign._id || assign.id, STATUS.PUBLISHED)} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-md font-bold flex gap-1 hover:bg-green-200"><Upload className="w-3 h-3"/> Publish</button>}
                            {assign.status === STATUS.PUBLISHED && <button onClick={() => handleStatusChange(assign._id || assign.id, STATUS.COMPLETED)} className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-md font-bold flex gap-1 hover:bg-slate-700"><CheckCircle className="w-3 h-3"/> Close</button>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </main>

      <Modal isOpen={modalType === 'create'} onClose={() => setModalType(null)} title={ 'New Assignment' }>
        <form onSubmit={handleSave}>
            <InputField label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border p-2.5 rounded-lg h-32 focus:ring-2 outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <InputField label="Due Date" type="date" value={form.dueDate ? form.dueDate.split('T')[0] : ''} onChange={e => setForm({...form, dueDate: e.target.value})} required />
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
      </Modal>

      <Modal isOpen={modalType === 'view'} onClose={() => setModalType(null)} title={`Submissions: ${selectedItem?.title}`} size="lg">
         {submissions.length === 0 ? <p className="text-center text-slate-400 py-10">No submissions yet.</p> : (
             <div className="space-y-4">
                 {submissions.map((sub, idx) => (
                     <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                         <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
                             <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                                     {sub.studentId?.name?.[0] || 'S'}
                                 </div>
                                 <div>
                                     <p className="text-sm font-bold text-slate-700">{sub.studentId?.name}</p>
                                     <p className="text-xs text-slate-500">{sub.studentId?.email}</p>
                                 </div>
                             </div>
                             <span className="text-xs text-slate-500">{new Date(sub.submittedDate).toLocaleString()}</span>
                         </div>
                         <div className="bg-white p-3 rounded-lg border border-slate-100 text-sm font-mono text-slate-700 whitespace-pre-wrap">{sub.answer}</div>
                     </div>
                 ))}
             </div>
         )}
      </Modal>
    </div>
  );
};

export default TeacherDashboard;