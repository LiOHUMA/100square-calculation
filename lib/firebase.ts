//  @package      lib/firebase.ts
//  @description  firebaseライブラリ。
//                firebaseを使用するための設定。
//  @created      2025-04-27 by uma
//  @version      1.0.0
//  @lastModified 2025-04-27 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 設定情報（Firebaseコンソールで確認）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
