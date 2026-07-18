import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/auth';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('密码至少 6 位');
      return;
    }
    if (password !== confirm) {
      setError('两次密码不一致');
      return;
    }

    const result = register(email, password);
    if (result.ok) {
      navigate('/onboarding');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,105,140,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,105,140,0.05) 0%, transparent 70%)' }} />

      {/* Logo */}
      <Link to="/" className="absolute top-8 left-10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-[#f06a9a] flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-[#111]">FitHer</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[400px] mx-6 bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-[#111] mb-2">创建账号</h2>
        <p className="text-gray-400 mb-8">开始你的健身之旅</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f06a9a] focus:ring-2 focus:ring-[#fde8ef] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="至少 6 位"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f06a9a] focus:ring-2 focus:ring-[#fde8ef] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">确认密码</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="再次输入密码"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f06a9a] focus:ring-2 focus:ring-[#fde8ef] transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#F56898] to-[#FF9ABB] text-white font-semibold rounded-xl shadow-lg shadow-[#f06a9a]/20 mt-2"
          >
            立即注册
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          已有账号？
          <Link to="/login" className="text-[#f06a9a] font-medium ml-1 hover:underline">
            去登录
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
