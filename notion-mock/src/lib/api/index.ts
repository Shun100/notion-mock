// axiosの設定
import axios from "axios";
import { AddAuthorizationHeader } from "./interceptors/request";

const baseURL = import.meta.env.VITE_API_URL // 環境変数の読込 localhost:8888

// デフォルトコンテストパスにbaseURLを設定
const api = axios.create({ baseURL });

// ヘッダのデフォルト値の設定
api.defaults.headers.common["Content-Type"] = 'application/json';
api.interceptors.request.use(AddAuthorizationHeader); // 認証情報追加

// 他ファイルから参照できるようエクスポート
// 例. api.post('/signup'); ⇒ api.post('http://localhost:8888/signup');
export default api;