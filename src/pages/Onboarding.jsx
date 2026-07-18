import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { goalOptions, bodyPartOptions } from '../data/rules';
import { storage } from '../utils/storage';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    dailyMinutes: '',
    goal: '',
    bodyParts: [],
    bodyFat: '',
    planDays: '',
    restrictions: [],
    menstrual: false,
    menstrualDays: '',
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleBodyPart = (part) => {
    const current = form.bodyParts;
    if (current.includes(part)) {
      update('bodyParts', current.filter((p) => p !== part));
    } else {
      update('bodyParts', [...current, part]);
    }
  };

  const toggleRestriction = (item) => {
    const val = form.restrictions.includes(item)
      ? form.restrictions.filter((r) => r !== item)
      : [...form.restrictions, item];
    update('restrictions', val);
  };

  const handleFinish = () => {
    if (!form.goal || !form.dailyMinutes || !form.planDays) return;

    const profile = {
      ...form,
      dailyMinutes: parseInt(form.dailyMinutes),
      planDays: parseInt(form.planDays),
    };
    storage.set('profile', profile);
    navigate('/plan');
  };

  const step1Valid = form.goal && form.dailyMinutes >= 10;
  const step2Valid = form.planDays >= 7;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden px-4">
      {/* 背景装饰 */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,105,140,0.06) 0%, transparent 70%)' }} />

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
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[520px] bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100"
      >
        {/* 步骤指示器 */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step >= s ? 'bg-[#f06a9a] text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-[#f06a9a]' : 'bg-gray-100'}`} />}
            </div>
          ))}
          <span className="text-xs text-gray-400 ml-2">
            {step === 1 ? '训练偏好' : step === 2 ? '计划设置' : '身体信息'}
          </span>
        </div>

        {/* ====== Step 1: 训练偏好 ====== */}
        {step === 1 && (
          <>
            <h3 className="text-2xl font-bold text-[#111] mb-6">你的训练目标是什么？</h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {goalOptions.map((g) => (
                <button
                  key={g.value}
                  onClick={() => update('goal', g.value)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    form.goal === g.value
                      ? 'border-[#f06a9a] bg-[#fde8ef]'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <div className="font-semibold text-[#111] mt-1">{g.label}</div>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                每日空闲训练时间（分钟）
              </label>
              <input
                type="number"
                value={form.dailyMinutes}
                onChange={(e) => update('dailyMinutes', e.target.value)}
                min={10}
                placeholder="例如：30"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f06a9a] focus:ring-2 focus:ring-[#fde8ef] transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                重点训练部位（选填，不选默认全身）
              </label>
              <div className="flex flex-wrap gap-2">
                {bodyPartOptions.map((bp) => (
                  <button
                    key={bp.value}
                    onClick={() => toggleBodyPart(bp.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      form.bodyParts.includes(bp.value)
                        ? 'bg-[#f06a9a] text-white'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {bp.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className="w-full py-3.5 bg-gradient-to-r from-[#F56898] to-[#FF9ABB] text-white font-semibold rounded-xl shadow-lg shadow-[#f06a9a]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              下一步
            </button>
          </>
        )}

        {/* ====== Step 2: 计划设置 ====== */}
        {step === 2 && (
          <>
            <h3 className="text-2xl font-bold text-[#111] mb-6">设置你的训练周期</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                计划总天数（最少 7 天）
              </label>
              <input
                type="number"
                value={form.planDays}
                onChange={(e) => update('planDays', e.target.value)}
                min={7}
                placeholder="例如：14"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f06a9a] focus:ring-2 focus:ring-[#fde8ef] transition-all"
              />
              <p className="text-xs text-gray-400 mt-1.5">可填 7、10、14、30 等任意天数</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">饮食忌口（选填）</label>
              <div className="flex flex-wrap gap-2">
                {['海鲜', '坚果', '乳制品', '豆制品', '麸质', '辛辣', '生冷'].map((r) => (
                  <button
                    key={r}
                    onClick={() => toggleRestriction(r)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      form.restrictions.includes(r)
                        ? 'bg-[#f06a9a] text-white'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                上一步
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!step2Valid}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#F56898] to-[#FF9ABB] text-white font-semibold rounded-xl shadow-lg shadow-[#f06a9a]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                下一步
              </button>
            </div>
          </>
        )}

        {/* ====== Step 3: 身体信息 ====== */}
        {step === 3 && (
          <>
            <h3 className="text-2xl font-bold text-[#111] mb-6">最后一步：身体信息</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                体脂率（选填，不知道可跳过）
              </label>
              <input
                type="text"
                value={form.bodyFat}
                onChange={(e) => update('bodyFat', e.target.value)}
                placeholder="例如：25%，或填「不知道」"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f06a9a] focus:ring-2 focus:ring-[#fde8ef] transition-all"
              />
              <p className="text-xs text-gray-400 mt-1.5">不确定？填"不知道"即可，不影响计划生成</p>
            </div>

            <div className="mb-6 p-4 rounded-2xl bg-[#fef1f7] border border-[#fde8ef]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.menstrual}
                  onChange={(e) => update('menstrual', e.target.checked)}
                  className="w-4 h-4 accent-[#f06a9a]"
                />
                <span className="text-sm font-medium text-gray-700">需要经期提醒</span>
              </label>
              {form.menstrual && (
                <div className="mt-3">
                  <input
                    type="number"
                    value={form.menstrualDays}
                    onChange={(e) => update('menstrualDays', e.target.value)}
                    placeholder="周期天数，例如：28"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f06a9a] focus:ring-2 focus:ring-[#fde8ef] transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">经期前 2 天会自动调整为休息/拉伸训练</p>
                  <p className="text-xs text-gray-400 mt-0.5">仅自己可见 🔒</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                上一步
              </button>
              <button
                onClick={handleFinish}
                disabled={!form.goal}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#F56898] to-[#FF9ABB] text-white font-semibold rounded-xl shadow-lg shadow-[#f06a9a]/20 transition-all"
              >
                生成我的训练计划 ✨
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
