import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [role, setRole] = useState('user'); 
  const navigate = useNavigate();
  const location = useLocation();

  //  Detect ?admin=true from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('admin') === 'true') {
      setRole('admin');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '/auth/login';
      let payload = { email, password };

      // for admin
      if (role === 'admin') {
        endpoint = '/auth/login/admin';   
        payload.adminKey = adminKey;
      } else {
        payload.role = role;
      }

      const res = await api.post(endpoint, payload);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);

      toast.success('Login successful');

      //  Redirect by role
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'store_owner') navigate('/owner');
      else navigate('/user');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg text-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {/* Role selection only if not admin */}
        {role !== 'admin' && (
          <div className="flex gap-4 mb-6">
            <div
              onClick={() => setRole('user')}
              className={`flex-1 p-4 rounded-xl border cursor-pointer text-center transition-colors ${
                role === 'user'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-900 border-gray-700 text-white hover:border-blue-500'
              }`}
            >
              <span className="block text-lg font-semibold">User</span>
              <p className="text-xs mt-1 text-gray-300">Browse & rate stores</p>
            </div>
            <div
              onClick={() => setRole('store_owner')}
              className={`flex-1 p-4 rounded-xl border cursor-pointer text-center transition-colors ${
                role === 'store_owner'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-900 border-gray-700 text-white hover:border-blue-500'
              }`}
            >
              <span className="block text-lg font-semibold">Store Owner</span>
              <p className="text-xs mt-1 text-gray-300">Manage your store</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          {/*  Only show if admin mode */}
          {role === 'admin' && (
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 text-sm"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin Key"
              required
            />
          )}

          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-sky-400 font-medium transition-colors text-sm"
          >
            Login
          </button>
        </form>

        {role !== 'admin' && (
          <button
            onClick={() => navigate('/signup')}
            className="w-full p-3 mt-3 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-sky-400 font-medium transition-colors text-sm"
          >
            Create New Account
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;
