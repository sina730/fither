import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = ['首页', '训练计划', '饮食建议', '器材教学', '关于我们'];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 h-[76px] flex items-center"
    >
      <div className="glass-strong w-full max-w-[1280px] mx-auto rounded-2xl px-5 md:px-8 h-[60px] flex items-center justify-between shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        {/* ── Logo ── */}
        <a href="#" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center shadow-lg shadow-coral-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-white">FitHer</span>
            <span className="text-[9px] text-gray-500 tracking-[0.15em]">为更好的自己</span>
          </div>
        </a>

        {/* ── Desktop Nav ── */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = link === '首页';
            return (
              <a
                key={link}
                href="#"
                className={`relative px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${
                  active
                    ? 'text-white bg-[rgba(255,94,83,0.18)] border border-[rgba(255,94,83,0.3)]'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                {link}
                {active && (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 bg-[rgba(255,94,83,0.12)] rounded-full border border-[rgba(255,94,83,0.25)]"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* ── Desktop Right ── */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language */}
          <button className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-200 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.03)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            中
          </button>

          <a href="#" className="text-[13px] font-medium text-gray-400 hover:text-gray-100 transition-colors px-3 py-2">
            登录
          </a>
          <a href="#" className="btn-primary text-[13px] px-5 py-2.5">
            开始训练
          </a>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-gray-400 hover:text-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            )}
          </svg>
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute top-[84px] left-4 right-4 glass rounded-2xl p-5 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = link === '首页';
                return (
                  <a
                    key={link}
                    href="#"
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      active
                        ? 'text-white bg-[rgba(255,94,83,0.15)] border border-[rgba(255,94,83,0.2)]'
                        : 'text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
                    }`}
                  >
                    {link}
                  </a>
                );
              })}
              <hr className="my-2 border-white/5" />
              <div className="flex items-center gap-2 px-4 py-3">
                <button className="flex items-center gap-1.5 text-sm text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  中文
                </button>
                <a href="#" className="text-sm text-gray-400 ml-auto">登录</a>
              </div>
              <a href="#" className="btn-primary text-sm px-5 py-3 text-center mt-1">
                开始训练
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
