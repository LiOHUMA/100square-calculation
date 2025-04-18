import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";

export default function Settings() {
    const router = useRouter();

    const handleChangeNickname = () => {
        router.push("/settings/nickname");
    };
  
    const handleChangePassword = () => {
        router.push("/settings/password");
    };
  
    const handleBackToMenu = () => {
        router.push("/menu");
    };

    return (
        <AuthGuard>
            <div>
                <h1>ユーザ設定</h1>
                <p>ニックネーム、パスワードの変更ができます</p>
                <button onClick={handleChangeNickname}>ニックネームの変更</button>
                <button onClick={handleChangePassword}>パスワードの変更</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}