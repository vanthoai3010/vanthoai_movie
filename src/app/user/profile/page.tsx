"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/user/ChangePasswordModal";

// --- Helper Functions ---
function parseJwt(token: string): UserData {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    throw new Error("Invalid token format");
  }
}

// --- Interfaces ---
interface UserData {
  name: string;
  email: string;
  avatar?: string;
  gender?: string;
}

// --- SVG Icons ---
const HeartIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const ListIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const PlayIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;

// --- Main Page Component Wrapper ---
export default function UserUpdateFormWrapper() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      try {
        const decoded = parseJwt(token);
        setUser({
          name: decoded.name || 'User',
          email: decoded.email || '',
          avatar: decoded.avatar,
          gender: decoded.gender || "other",
        });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

   const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    window.location.reload()
  }

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-200">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-10 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <MenuIcon />
        </button>
        <h1 className="text-xl font-bold text-white">Tài khoản</h1>
        <div className="w-10"></div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-6">
        <Sidebar 
          user={user} 
          onLogout={handleLogout} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1">
          <UserUpdateForm 
            user={user} 
            setUser={setUser} 
            setShowPasswordModal={setShowPasswordModal} 
            showPasswordModal={showPasswordModal} 
          />
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </div>
  );
}

// --- Sidebar Component ---
function Sidebar({ user, onLogout, isOpen, onClose }: { 
  user: UserData, 
  onLogout: () => void, 
  isOpen: boolean,
  onClose: () => void
}) {
  const navItems = [
    { name: "Yêu thích", icon: <HeartIcon /> },
    { name: "Danh sách", icon: <ListIcon /> },
    { name: "Xem tiếp", icon: <PlayIcon /> },
    { name: "Tài khoản", icon: <UserIcon />, active: true },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <div 
        className={`
          fixed lg:sticky top-0 left-0 h-full w-80 z-30 lg:z-auto
          bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-2xl
          flex flex-col justify-between shadow-2xl border border-gray-800
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Quản lý tài khoản</h1>
            <button 
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav>
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.name}>
                  <button
                    className={`flex items-center w-full p-3 rounded-xl transition-all ${
                      item.active
                        ? "bg-gradient-to-r from-amber-600/30 to-amber-800/30 text-amber-300 shadow-lg"
                        : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center p-3 bg-gray-800/50 rounded-xl mb-4">
            <div className="relative">
              <Image
                src={user.avatar || "https://i.imgur.com/3o1oJ2m.png"}
                alt="User Avatar"
                width={48}
                height={48}
                className="rounded-full object-cover border-2 border-amber-500"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="ml-3">
              <p className="font-semibold text-white">{user.name || 'User'}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center w-full p-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition-colors"
          >
            <LogoutIcon />
            <span>Thoát</span>
          </button>
        </div>
      </div>
    </>
  );
}

// --- Form Component ---
function UserUpdateForm({ user, setUser, setShowPasswordModal, showPasswordModal }: { 
  user: UserData, 
  setUser: (user: UserData) => void, 
  setShowPasswordModal: (value: boolean) => void, 
  showPasswordModal: boolean 
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    gender: ["male", "female"].includes(user.gender || "") ? user.gender : "other",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      if (data.newToken) {
        localStorage.setItem("token", data.newToken);
        const decoded = parseJwt(data.newToken);
        const updatedUser = {
          name: decoded.name || 'User',
          email: decoded.email || '',
          avatar: decoded.avatar,
          gender: decoded.gender || "other",
        };
        setUser(updatedUser);
        setFormData({ name: updatedUser.name || 'User', gender: updatedUser.gender || 'other' });
      }

      setMessage({ text: "Cập nhật thành công!", type: "success" });

    } catch (error: any) {
      setMessage({ text: error.message || "Có lỗi xảy ra khi cập nhật", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 lg:p-8 shadow-2xl">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Hồ sơ cá nhân</h2>
            <p className="text-gray-400 mt-2">Cập nhật thông tin tài khoản của bạn</p>
          </div>
          <div className="relative">
            <Image
              src={user.avatar || "https://i.imgur.com/3o1oJ2m.png"}
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full object-cover border-2 border-amber-500"
            />
            <button 
              className="absolute -bottom-1 -right-1 bg-amber-600 p-1 rounded-full hover:bg-amber-500 transition-colors"
              onClick={() => {}}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <div className="w-full p-3 bg-gray-800/50 rounded-xl text-gray-300 border border-gray-700">
              {user.email}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Tên hiển thị</label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Giới tính</label>
            <div className="flex flex-wrap gap-4">
              {["Nam", "Nữ", "Không xác định"].map(label => {
                const value = label === "Nam" ? "male" : label === "Nữ" ? "female" : "other";
                return (
                  <label key={value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={value}
                      checked={formData.gender === value}
                      onChange={() => setFormData(prev => ({ ...prev, gender: value }))}
                      className="sr-only"
                    />
                    <div className={`
                      flex items-center px-4 py-2 rounded-lg border transition-all
                      ${formData.gender === value 
                        ? 'bg-amber-900/30 border-amber-500 text-amber-300' 
                        : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center border mr-2 ${formData.gender === value ? 'border-amber-500' : 'border-gray-500'}`}>
                        {formData.gender === value && <span className="w-2 h-2 bg-amber-500 rounded-full"></span>}
                      </span>
                      <span>{label}</span>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-6">
              Để thay đổi mật khẩu, nhấn vào{" "}
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="text-amber-400 cursor-pointer hover:underline font-medium"
              >
                đây
              </button>
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
              {message.text && (
                <div className={`text-sm font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message.text}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl hover:from-amber-500 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang cập nhật...
                  </span>
                ) : "Cập nhật hồ sơ"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}