//  @package      components/ui/Button,tsx
//  @description  エラーメッセージ共通機能。
//                エラーメッセージを作成する。
//  @created      2025-07-10 by uma
//  @version      1.0.0
//  @lastModified 2025-07-10 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


type Props = { message: string };

export default function ErrorMessage({ message }: Props) {
  return (
    <p className="text-red-500 text-base font-semibold my-2">
      ⚠️ {message}
    </p>
  );
}