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

  const inputFocus = (e) => {
    e.target.style.borderColor = '#f06a9a';
    e.target.style.boxShadow = '0 0 0 3px rgba(240,106,154,0.12)';
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = '#e8e8e8';
    e.target.style.boxShadow = 'none';
  };
  const inputEnter = (e) => {
    if (document.activeElement !== e.target) e.target.style.borderColor = '#f8b2c2';
  };
  const inputLeave = (e) => {
    if (document.activeElement !== e.target) e.target.style.borderColor = '#e8e8e8';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ backgroundImage: 'url(./其他页面底图.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* 径向渐变遮罩 */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.06) 100%)' }}
      />

      {/* ====== 左上 Logo ====== */}
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

      {/* ====== 注册卡片 ====== */}
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
            创建账号
          </h2>
          <p className="text-[15px] text-[#999] mt-[4px]">
            开始你的健身之旅
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col" style={{ marginTop: '28px' }}>
            {/* 邮箱 */}
            <div>
              <label className="block text-[14px] font-medium text-[#555] mb-[8px]">邮箱</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="your@email.com"
                className="w-full h-[46px] rounded-[10px] border border-[#e8e8e8] text-[14px] text-[#111] placeholder-[#bbb] bg-white transition-all duration-200"
                style={{ paddingLeft: '14px', paddingRight: '14px' }}
                onFocus={inputFocus} onBlur={inputBlur}
                onMouseEnter={inputEnter} onMouseLeave={inputLeave}
              />
            </div>

            {/* 密码 */}
            <div style={{ marginTop: '20px' }}>
              <label className="block text-[14px] font-medium text-[#555] mb-[8px]">密码</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="至少 6 位"
                className="w-full h-[46px] rounded-[10px] border border-[#e8e8e8] text-[14px] text-[#111] placeholder-[#bbb] bg-white transition-all duration-200"
                style={{ paddingLeft: '14px', paddingRight: '14px' }}
                onFocus={inputFocus} onBlur={inputBlur}
                onMouseEnter={inputEnter} onMouseLeave={inputLeave}
              />
            </div>

            {/* 确认密码 */}
            <div style={{ marginTop: '20px' }}>
              <label className="block text-[14px] font-medium text-[#555] mb-[8px]">确认密码</label>
              <input
                type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                required placeholder="再次输入密码"
                className="w-full h-[46px] rounded-[10px] border border-[#e8e8e8] text-[14px] text-[#111] placeholder-[#bbb] bg-white transition-all duration-200"
                style={{ paddingLeft: '14px', paddingRight: '14px' }}
                onFocus={inputFocus} onBlur={inputBlur}
                onMouseEnter={inputEnter} onMouseLeave={inputLeave}
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <p className="text-red-500 text-[13px] text-center mt-[14px]">{error}</p>
            )}

            {/* 注册按钮 */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, translateY: -3, boxShadow: '0 18px 50px rgba(240,106,154,0.32)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1.2] }}
              className="w-full h-[48px] text-white text-[16px] font-semibold rounded-[30px] transition-all"
              style={{
                marginTop: '28px',
                background: 'linear-gradient(135deg, #F56898 0%, #FF9ABB 100%)',
                boxShadow: '0 10px 35px rgba(240,106,154,0.25)',
              }}
            >
              立即注册
            </motion.button>
          </form>

          {/* 登录提示 */}
          <p
            className="text-center text-[14px] text-[#aaa] flex items-center justify-center"
            style={{ marginTop: '20px' }}
          >
            已有账号？
            <Link
              to="/login"
              className="text-[#f06a9a] font-medium ml-1 hover:underline underline-offset-2 transition-all duration-200"
            >
              去登录
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
