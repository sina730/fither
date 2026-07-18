import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.ok) {
      navigate('/plan');
    } else {
      setError(result.error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ backgroundImage: 'url(./其他页面底图.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* 径向渐变遮罩：中心亮、边缘暗 */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.06) 100%)',
        }}
      />

      {/* ====== 左上 Logo —— 完全复用主页样式 ====== */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-7 left-7 md:top-10 md:left-10 z-20"
      >
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-[#f06a9a] flex items-center justify-center shadow-lg shadow-[#f06a9a]/25">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-[26px] font-bold tracking-tight text-[#111]">FitHer</span>
            <span className="text-[12px] text-[#f06a9a] tracking-wide">为更好的自己</span>
          </div>
        </Link>
      </motion.div>

      {/* ====== 登录卡片 ====== */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 w-[92vw] max-w-[450px] mx-auto"
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(240,140,170,0.12), 0 2px 8px rgba(240,140,170,0.06)',
            padding: '36px 32px',
          }}
        >
          {/* 标题 */}
          <h2 className="text-[30px] font-bold text-[#111] leading-tight">
            欢迎回来
          </h2>
          <p className="text-[15px] text-[#999] mt-[4px]">
            登录你的 FitHer 账号
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col" style={{ marginTop: '28px' }}>
            {/* 邮箱 */}
            <div>
              <label className="block text-[14px] font-medium text-[#555] mb-[8px]">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full h-[46px] rounded-[10px] border border-[#e8e8e8] text-[14px] text-[#111] placeholder-[#bbb] bg-white transition-all duration-200"
                style={{ paddingLeft: '14px', paddingRight: '14px' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f06a9a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(240,106,154,0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8e8e8';
                  e.target.style.boxShadow = 'none';
                }}
                onMouseEnter={(e) => {
                  if (document.activeElement !== e.target) e.target.style.borderColor = '#f8b2c2';
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.target) e.target.style.borderColor = '#e8e8e8';
                }}
              />
            </div>

            {/* 密码 */}
            <div style={{ marginTop: '20px' }}>
              <label className="block text-[14px] font-medium text-[#555] mb-[8px]">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="输入密码"
                className="w-full h-[46px] rounded-[10px] border border-[#e8e8e8] text-[14px] text-[#111] placeholder-[#bbb] bg-white transition-all duration-200"
                style={{ paddingLeft: '14px', paddingRight: '14px' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f06a9a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(240,106,154,0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8e8e8';
                  e.target.style.boxShadow = 'none';
                }}
                onMouseEnter={(e) => {
                  if (document.activeElement !== e.target) e.target.style.borderColor = '#f8b2c2';
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.target) e.target.style.borderColor = '#e8e8e8';
                }}
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <p className="text-red-500 text-[13px] text-center mt-[14px]">{error}</p>
            )}

            {/* 登录按钮 —— 主页胶囊同款 */}
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.05,
                translateY: -3,
                boxShadow: '0 18px 50px rgba(240,106,154,0.32)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1.2] }}
              className="w-full h-[48px] text-white text-[16px] font-semibold rounded-[30px] transition-all"
              style={{
                marginTop: '28px',
                background: 'linear-gradient(135deg, #F56898 0%, #FF9ABB 100%)',
                boxShadow: '0 10px 35px rgba(240,106,154,0.25)',
              }}
            >
              登录
            </motion.button>
          </form>

          {/* 注册提示 */}
          <p
            className="text-center text-[14px] text-[#aaa] flex items-center justify-center"
            style={{ marginTop: '20px' }}
          >
            还没有账号？
            <Link
              to="/register"
              className="text-[#f06a9a] font-medium ml-1 hover:underline underline-offset-2 transition-all duration-200"
            >
              立即注册
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
