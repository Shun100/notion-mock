// リクエスト送信の度に行う共通処理

import type { InternalAxiosRequestConfig } from "axios";

/**
 * Axiosのリクエストヘッダにユーザ認証用の情報を書き込む
 * @param config {InternalAxiosRequestConfig} - Axiosが内部で使っている「リクエスト設定オブジェクト」
 * @returns config {InternalAxiosRequestConfig} - 同上
 */
export const AddAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return config;
  }

  /**
   * Bearer: 「このトークンを持っている人にアクセス権を与える」という意味
   * 「OAuth 2.0」というプロトコルで定義されている認証方式
   * 例. Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   */
  config.headers.Authorization = `Bearer ${token}`;
  return config
}