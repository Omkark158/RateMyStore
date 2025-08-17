import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function UserForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });

  const handleSubmit = async () => {
    try {
      const res = await api.post('/users', form);   
      const newUser = res.data;

      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
      toast.success('User added successfully');

      if (onSuccess) onSuccess(newUser);  
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error adding user');
    }
  };

  return (
    <div className="mb-6 bg-gray-900 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-3">Add User</h3>
      {['name','email','password','address'].map(field => (
        <input
          key={field}
          type={field==='password' ? 'password' : 'text'}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
          className="w-full p-2 mb-2 rounded bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
        />
      ))}
      <select
        className="border p-2 mb-2 w-full rounded bg-gray-800 text-gray-100"
        value={form.role}
        onChange={e => setForm({ ...form, role: e.target.value })}
      >
        <option value="user">User</option>
        <option value="store_owner">Store Owner</option>
        <option value="admin">Admin</option>
      </select>
      <button
        className="w-full p-2 rounded bg-blue-600 hover:bg-blue-700 font-medium transition-colors"
        onClick={handleSubmit}
      >
        Add
      </button>
    </div>
  );
}
