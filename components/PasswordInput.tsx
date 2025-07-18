//  @package      components/PasswordInput.tsx
//  @description  パスワード入力共通機能。
//                パスワード入力のinputを作成する。
//  @created      2025-06-26 by uma
//  @version      1.0.0
//  @lastModified 2025-06-26 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState } from "react";
import "../styles/globals.css";

type Props = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
};

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder = "パスワードを入力",
  required = false,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
        {label && <label className="block text-lg font-semibold text-gray-700 mb-1">{label}</label>}
        <input
            type={visible ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "パスワードを非表示" : "パスワードを表示"}
            className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 flex items-center gap-1 text-sm font-semibold transition"
        >
            {visible ? "非表示" : "表示"}
        </button>
    </div>
  );
}