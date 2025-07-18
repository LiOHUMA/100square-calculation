//  @package      components/ui/Button,tsx
//  @description  ボタン共通機能。
//                ボタンを作成する。
//  @created      2025-07-12 by uma
//  @version      1.0.0
//  @lastModified 2025-07-12 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  color?: "primary" | "back" | "danger" | "continue" | "gamesetting" | "game";
  disabled?: boolean;
};

export default function Button({ children, onClick, type = "button", color = "primary", disabled = false }: Props) {
  const base = "py-3 px-5 rounded-2xl font-semibold text-lg shadow-md transition w-full";
  const colors = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    back: "bg-gray-400 text-white hover:bg-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600",
    continue: "bg-indigo-500 text-white hover:bg-indigo-600",
    gamesetting: "bg-yellow-500 text-white hover:bg-yellow-600",
    game: "bg-green-500 text-white hover:bg-green-600"
  };

  return (
    <motion.button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${base} ${colors[color]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}