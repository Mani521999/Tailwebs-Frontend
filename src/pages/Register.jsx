import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/auth.service';
import { validateEmail } from '../utils/validators';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email";
    if (formData.password.length < 6) newErrors.password = "Min 6 characters";
    
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setLoading(true);
    try {
      await authService.register(formData);
      toast.success("Registration successful! Please login.");
      navigate('/');
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <InputField label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} error={errors.name} />
          <InputField label="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} error={errors.email} />
          <InputField label="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} error={errors.password} />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a:</label>
            <select 
              className="w-full border p-2.5 rounded-lg focus:ring-2 outline-none border-gray-300"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <Button type="submit" isLoading={loading} className="w-full">Register</Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;