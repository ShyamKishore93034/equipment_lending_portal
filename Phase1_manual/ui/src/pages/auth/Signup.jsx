import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await signup(form.name, form.email, form.password, form.role);
      login(data.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-600 px-3 py-2 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <select
            name="role"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            value={form.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition text-white font-medium py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-blue-600">
          <a href="/login" className="hover:underline">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}
