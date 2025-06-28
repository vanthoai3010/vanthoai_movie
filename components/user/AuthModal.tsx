// components/AuthModal.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  CheckCircle,
  AlertTriangle,
  User,
  Mail,
  Lock
} from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type NotificationType = {
  message: string
  type: 'success' | 'error'
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<{ [k: string]: string }>({})
  const [notification, setNotification] =
    useState<NotificationType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setErrors({})
      setNotification(null)
      setForm({ name: '', email: '', password: '' })
    }
  }, [isLogin, isOpen])

  const validate = () => {
    const newErr: { [k: string]: string } = {}
    if (!isLogin && !form.name.trim())
      newErr.name = 'Vui lòng nhập tên của bạn.'
    if (!form.email) newErr.email = 'Vui lòng nhập email.'
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErr.email = 'Email không hợp lệ.'
    if (!form.password) newErr.password = 'Vui lòng nhập mật khẩu.'
    else if (form.password.length < 6)
      newErr.password = 'Mật khẩu tối thiểu 6 ký tự.'
    setErrors(newErr)
    return Object.keys(newErr).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    setNotification(null)
    const ep = isLogin ? '/api/auth/login' : '/api/auth/register'
    try {
      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email: form.email, password: form.password } : form)
      })
      const data = await res.json()
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token)
          setNotification({ message: 'Đăng nhập thành công!', type: 'success' })
          setTimeout(() => {
            onClose()
            window.location.reload()
          }, 1200)
        } else {
          setNotification({ message: '🎉 Đăng ký thành công! Hãy đăng nhập.', type: 'success' })
          setIsLogin(true)
        }
      } else {
        setNotification({ message: data.message || 'Đã có lỗi xảy ra.', type: 'error' })
      }
    } catch {
      setNotification({ message: 'Không thể kết nối đến server.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Đóng"
              className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Tabs */}
            <div className="flex">
              {['Đăng nhập', 'Đăng ký'].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setIsLogin(idx === 0)}
                  className={`flex-1 py-3 text-center font-medium transition-all ${
                    (isLogin && idx === 0) || (!isLogin && idx === 1)
                      ? 'border-b-4 border-sky-500 text-sky-600'
                      : 'text-gray-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className="px-6 py-8 sm:px-8"
              variants={containerVariants}
            >
              {/* Notification */}
              {notification && (
                <motion.div
                  variants={itemVariants}
                  className={`flex items-center gap-2 mb-4 p-3 rounded-lg text-sm ${
                    notification.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {notification.type === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertTriangle size={20} />
                  )}
                  {notification.message}
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="space-y-4">
                {/* Name */}
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute top-3 left-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Tên của bạn"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg text-black bg-gray-100 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                        errors.name
                          ? 'border border-red-500 focus:ring-red-400'
                          : 'border-transparent focus:ring-sky-400'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg text-black bg-gray-100 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      errors.email
                        ? 'border border-red-500 focus:ring-red-400'
                        : 'border-transparent focus:ring-sky-400'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className={`w-full pl-10 text-black pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      errors.password
                        ? 'border border-red-500 focus:ring-red-400'
                        : 'border-transparent focus:ring-sky-400'
                    }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-white font-semibold rounded-lg transition-colors bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500"
                >
                  {isLoading
                    ? 'Đang xử lý...'
                    : isLogin
                    ? 'Đăng nhập'
                    : 'Đăng ký'}
                </button>
              </motion.div>
            </motion.form>

            {/* Footer */}
            <motion.div
              variants={itemVariants}
              className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-center text-sm text-gray-500"
            >
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sky-600 font-semibold hover:underline"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
