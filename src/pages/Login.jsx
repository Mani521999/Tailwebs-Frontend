import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/auth.service';
import { validateEmail } from '../utils/validators';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(user.role === 'teacher' ? '/teacher' : '/student');
  }, [user, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setApiError('');
    try {
      const data = await authService.login(formData.email, formData.password);
      login(data);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">LMS Portal</h2>
        
        {apiError && <div className="bg-red-50 text-red-600 p-3 mb-4 rounded text-sm text-center">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <InputField 
            label="Email" 
            name="email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            error={errors.email}
          />
          <InputField 
            label="Password" 
            type="password"
            name="password" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            error={errors.password}
          />
          <Button type="submit" isLoading={loading} className="w-full mt-2">Login</Button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;