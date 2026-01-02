import apiClient from './client';

export const assignmentService = {
  // Teacher
  getTeacherAssignments: () => apiClient.get('/assignments/teacher'),
  create: (data) => apiClient.post('/assignments', data),
  update: (id, data) => apiClient.put(`/assignments/${id}`, data),
  delete: (id) => apiClient.delete(`/assignments/${id}`),
  updateStatus: (id, status) => apiClient.put(`/assignments/${id}/status`, { status }),
  getSubmissions: (id) => apiClient.get(`/submissions/assignment/${id}`),

  // Student
  getPublished: () => apiClient.get('/assignments/published'),
  submit: (id, answer) => apiClient.post('/submissions', { assignmentId: id, answer }),
  getMySubmission: (id) => apiClient.get(`/submissions/me/${id}`),
};