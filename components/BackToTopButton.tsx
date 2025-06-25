"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // icon hiện đại

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  // Hiện nút khi cuộn quá 300px
  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 cursor-pointer right-6 z-50 p-3 rounded-full transition-all 
        shadow-lg bg-yellow-400 hover:bg-yellow-500 text-black
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-0"}
      `}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
