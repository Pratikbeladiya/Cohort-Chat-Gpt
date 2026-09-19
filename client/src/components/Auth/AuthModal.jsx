import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({
          fullName: { firstName, lastName },
          email,
          password
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#2f2f2f] border border-[#383838] w-full max-w-sm rounded-2xl p-7 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-[#ececec] mb-6">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-2.5 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="First name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#212121] border border-[#383838] rounded-lg text-sm text-[#ececec] outline-none focus:border-[#10a37f]"
              />
              <input
                type="text"
                placeholder="Last name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#212121] border border-[#383838] rounded-lg text-sm text-[#ececec] outline-none focus:border-[#10a37f]"
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#212121] border border-[#383838] rounded-lg text-sm text-[#ececec] outline-none focus:border-[#10a37f]"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#212121] border border-[#383838] rounded-lg text-sm text-[#ececec] outline-none focus:border-[#10a37f]"
          />

          <button
            type="submit"
            className="w-full py-2.5 bg-[#10a37f] hover:bg-[#0e8e6e] text-white font-semibold rounded-lg text-sm transition-colors mt-2"
          >
            {isLogin ? 'Continue' : 'Sign up'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-neutral-400">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#10a37f] font-semibold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};