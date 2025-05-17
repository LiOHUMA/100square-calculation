//  @package      pages/index.tsx
//  @description  ルートページ。
//                login画面に遷移する。
//  @created      2025-05-17 by uma
//  @version      1.0.0
//  @lastModified 2025-05-17 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { GetServerSideProps } from "next";

// サーバーサイドリダイレクトの設定
export const getServerSideProps: GetServerSideProps = async () => {
    return{
        redirect:{
            destination: "/login", // リダイレクト先
            permanent: false // 一時的なリダイレクト(302)
        }
    };
};


// ページ本体は何も表示しない(リダイレクトされるため)
const Home = () => null;
export default Home;
