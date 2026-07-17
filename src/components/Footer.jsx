import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative py-14 md:py-16 bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-10 mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-gray-600 font-light text-sm tracking-[0.2em] flex items-center justify-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-coral-500/60" />
          专为女性打造的健身平台
          <span className="w-1.5 h-1.5 rounded-full bg-coral-500/60" />
        </p>
        <p className="text-gray-700 font-light text-xs mt-4 tracking-wider">
          © 2025 FitHer. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
