export interface User {
    id: string;
    userid: string;
    name: string;
    password: string;
    grade: number;
    role: number;
    hashFlg: number;
    createdAt: Date;
    updatedAt: Date;
  }