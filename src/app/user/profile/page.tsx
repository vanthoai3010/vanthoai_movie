"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/user/ChangePasswordModal";


// --- Helper Functions (No changes needed) ---
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

// --- SVG Icons (for modern UI) ---
const HeartIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const ListIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const PlayIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


// --- Main Page Component Wrapper ---
export default function UserUpdateFormWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
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
          name: decoded.name,
          email: decoded.email,
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
    localStorage.removeItem("token");
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 rounded-4xl border-3 bg-[#1c1c1e] flex text-gray-200">
      <Sidebar user={user} onLogout={handleLogout} />
      <UserUpdateForm user={user} setUser={setUser} setShowPasswordModal={setShowPasswordModal} showPasswordModal={showPasswordModal} />
      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />

    </div>
  );
}



// --- Sidebar Component ---
function Sidebar({ user, onLogout }) {
  const navItems = [
    { name: "Yêu thích", icon: <HeartIcon /> },
    { name: "Danh sách", icon: <ListIcon /> },
    { name: "Xem tiếp", icon: <PlayIcon /> },
    { name: "Tài khoản", icon: <UserIcon />, active: true },
  ];

  return (
    <div className="w-1/4 bg-[#27272a] p-6 rounded-4xl flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-10 text-white">Quản lý tài khoản</h1>
        <nav>
          <ul className="space-y-4">
            {navItems.map(item => (
              <li key={item.name} className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${item.active
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}>
                {item.icon}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div>
        <div className="flex items-center mb-4">
          <Image
            src={user.avatar || "https://i.imgur.com/3o1oJ2m.png"} // Default Doge Avatar
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div className="ml-3">
            <p className="font-semibold text-white text-sm">{user.name}</p>
            <p className="text-gray-400 text-xs">{user.email}</p>
          </div>
        </div>
        {/* <button onClick={onLogout} className="flex items-center w-full p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
          <LogoutIcon />
          <span>Thoát</span>
        </button> */}
      </div>
    </div>
  );
}


// --- Form Component ---
function UserUpdateForm({ user, setUser, setShowPasswordModal, showPasswordModal }: { user: UserData, setUser: (user: UserData) => void, setShowPasswordModal: (value: boolean) => void, showPasswordModal: boolean }) {
  const [formData, setFormData] = useState({
    name: user.name,
    gender: ["male", "female"].includes(user.gender || "") ? user.gender : "other",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e) => {
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
          name: decoded.name,
          email: decoded.email,
          avatar: decoded.avatar,
          gender: decoded.gender || "other",
        };
        setUser(updatedUser);
        setFormData({ name: updatedUser.name, gender: updatedUser.gender });
      }

      setMessage({ text: "Cập nhật thành công!", type: "success" });

    } catch (error) {
      setMessage({ text: error.message || "Có lỗi xảy ra khi cập nhật", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-3/4 p-12">
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Tài khoản</h2>
        <p className="text-gray-400 mb-8">Cập nhật thông tin tài khoản</p>

        <form onSubmit={handleUpdate}>
          <div className="flex items-center mb-8">
            <Image
              src={user.avatar || "https://i.imgur.com/3o1oJ2m.png"} // Default Doge Avatar
              alt="User Avatar"
              width={150}
              height={180}
              className="rounded-full object-cover"
            />
            {/* <button type="button" className="ml-6 text-sm font-semibold text-yellow-400 hover:text-yellow-300">
              Đổi ảnh đại diện
            </button> */}
          </div>

          {/* Email (Read-only) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <div className="w-full p-3 bg-[#27272a] rounded-md text-gray-300">
              {user.email}
            </div>
          </div>

          {/* Display Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Tên hiển thị</label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-3 bg-[#27272a] border border-transparent rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-3">Giới tính</label>
            <div className="flex space-x-6 items-center">
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
                      className="sr-only" // Hide default radio
                    />
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${formData.gender === value ? 'border-blue-500' : 'border-gray-500'}`}>
                      {formData.gender === value && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>}
                    </span>
                    <span className="ml-3 text-gray-300">{label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Đổi mật khẩu, nhấn vào{" "}
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="text-yellow-400 cursor-pointer hover:underline font-semibold"
            >
              đây
            </button>
          </p>


          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
            {message.text && (
              <div className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message.text}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}