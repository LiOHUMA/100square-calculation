//  @package      components/PasswordInput.tsx
//  @description  パスワード入力共通機能。
//                パスワード入力のinputを作成する。
//  @created      2025-04-27 by uma
//  @version      1.0.0
//  @lastModified 2025-04-27 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState } from "react";

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
        {label && <label>{label}</label>}
        <input
            type={visible ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
        />
        <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
        >
            {visible ? "非表示" : "表示"}
        </button>
    </div>
  );
}