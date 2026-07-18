import { storage } from './storage';

// 简单邮箱验证
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 注册
export function register(email, password) {
  const users = storage.get('users') || [];

  if (users.find((u) => u.email === email)) {
    return { ok: false, error: '该邮箱已注册' };
  }

  const newUser = { email, password, createdAt: Date.now() };
  users.push(newUser);
  storage.set('users', users);

  // 自动登录
  storage.set('currentUser', newUser);
  return { ok: true };
}

// 登录
export function login(email, password) {
  const users = storage.get('users') || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { ok: false, error: '邮箱或密码错误' };
  }

  storage.set('currentUser', user);
  return { ok: true };
}

// 登出
export function logout() {
  storage.remove('currentUser');
}

// 获取当前用户
export function getCurrentUser() {
  return storage.get('currentUser');
}

// 是否已登录
export function isLoggedIn() {
  return !!getCurrentUser();
}
