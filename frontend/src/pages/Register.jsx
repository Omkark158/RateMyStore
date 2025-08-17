import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // No role in payload — backend will set role = 'user'
      await api.post('/auth/signup', { name, email, address, password });
      toast.success('Signed up successfully. Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error signing up');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg text-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            className="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 text-sm"
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Name" required
          />
          <input
            type="email"
            className="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 text-sm"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required
          />
          <input
            className="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 text-sm"
            value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Address" required
          />
          <input
            type="password"
            className="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 text-sm"
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required
          />
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium transition-colors text-sm"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
