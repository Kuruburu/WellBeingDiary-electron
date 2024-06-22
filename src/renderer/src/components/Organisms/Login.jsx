import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import WellBiengHeadline from '../Atoms/WellBiengHeadline';
import Cookies from 'js-cookie';

const Login = ({}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(''); // Clear previous errors

    try {
      const response = await api.post('https://localhost:7119/api/Account/login', formData);
      const token = response.data.token;
      Cookies.set('jwt', token, { secure: true, sameSite: 'Strict' });
      console.log('Login successful, token:', response);
      if (response.status === 200) {
        navigate('/main');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="min-h-screen p-24 bg-pink-100 flex flex-col items-center space-y-12">
      <WellBiengHeadline />
      <form 
        onSubmit={handleSubmit} 
        className={`bg-white p-8 rounded shadow-md w-full max-w-sm ${error ? 'h-auto' : 'h-96'}`}
      >
        <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 mb-4">
          Login
        </button>
        <div className='flex justify-between px-2'>
          <p>Don't have an account?</p>
          <Link to='/register' className='font-bold text-pink-500 hover:underline hover:text-pink-300 focus:text-pink-400'> Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
