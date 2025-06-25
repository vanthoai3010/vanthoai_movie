// components/AuthModal.tsx
'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Kiểu dữ liệu cho thông báo
type NotificationType = {
  message: string;
  type: 'success' | 'error';
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state khi chuyển tab hoặc đóng modal
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setNotification(null);
      setForm({ name: '', email: '', password: '' });
    }
  }, [isLogin, isOpen]);
  
  // Hàm validate form
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!isLogin && !form.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên của bạn.';
    }
    
    if (!form.email) {
      newErrors.email = 'Vui lòng nhập email.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Địa chỉ email không hợp lệ.';
    }
    
    if (!form.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email: form.email, password: form.password } : form;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          setNotification({ message: 'Đăng nhập thành công!', type: 'success' });
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1500); // Đợi 1.5s để user thấy thông báo
        } else {
          setNotification({ message: '🎉 Đăng ký thành công! Vui lòng đăng nhập.', type: 'success' });
          setIsLogin(true); // Tự động chuyển sang tab đăng nhập
        }
      } else {
        setNotification({ message: data.message || 'Đã có lỗi xảy ra.', type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Không thể kết nối đến máy chủ.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white p-6 md:p-8 rounded-xl w-full max-w-md relative text-slate-800 shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              aria-label="Đóng"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- Thông báo --- */}
              {notification && (
                <div className={`flex items-center p-3 rounded-md text-sm ${
                    notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {notification.type === 'success' ? <CheckCircle className="mr-2" size={20}/> : <AlertTriangle className="mr-2" size={20}/>}
                  {notification.message}
                </div>
              )}
              
              {/* --- Input Tên --- */}
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    placeholder="Tên của bạn"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full border px-4 py-3 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 transition-all ${
                      errors.name ? 'border-red-500 focus:ring-red-400' : 'border-slate-200 focus:ring-sky-400'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.name}</p>}
                </div>
              )}

              {/* --- Input Email --- */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full border px-4 py-3 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-400' : 'border-slate-200 focus:ring-sky-400'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email}</p>}
              </div>

              {/* --- Input Mật khẩu --- */}
              <div>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full border px-4 py-3 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 transition-all ${
                    errors.password ? 'border-red-500 focus:ring-red-400' : 'border-slate-200 focus:ring-sky-400'
                  }`}
                />
                {errors.password && <p className="text-red-500  text-xs font-bold mt-1 ml-1">{errors.password}</p>}
              </div>
              
              {/* --- Nút Submit --- */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                {isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-slate-500">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sky-600 font-semibold cursor-pointer hover:underline"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}