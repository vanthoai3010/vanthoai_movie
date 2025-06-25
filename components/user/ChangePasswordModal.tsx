// components/user/ChangePasswordModal.tsx
"use client"
import { useState } from "react"

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu mới không khớp")
            return
        }

        try {
            const token = localStorage.getItem("token")
            const res = await fetch("/api/user/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setMessage("Đổi mật khẩu thành công!")
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (err) {
            setMessage(err.message)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-[#27272a] w-full max-w-md rounded-lg p-6 text-white">
                <h2 className="text-lg font-semibold mb-4 text-center">Đổi mật khẩu</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Mật khẩu cũ"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                        required
                    />
                    {message && (
                        <p className={`text-sm ${message.includes("thành công") ? "text-green-400" : "text-red-400"}`}>{message}</p>
                    )}
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
                        >
                            Đổi mật khẩu
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-300"
                        >
                            Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
