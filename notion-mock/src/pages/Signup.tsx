import { useState } from 'react';
import '../styles/pages/auth.css';
import { authRepository } from '../modules/auth/auth.repository';
import type User from '../modules/users/user.entity';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../modules/auth/current-user.state';
import { Navigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [isSubmitting, setIsSubmitting] = useState(false); // APIとの通信中

  // ユーザ登録
  const signup = async () => {
    setIsSubmitting(true);
    try {
      const { user, token }: { user: User, token: string } = await authRepository.signup(name, email, password);
      setCurrentUser(user); // ログイン中のユーザに設定

      // Local Storageにアクセストークンを保存
      localStorage.setItem('token', token);
    } catch (error) {
      console.error(error);
      alert('ユーザ登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }

  // アクセストークン読出

  // ログイン済みの状態でサインアップ画面のURLにアクセスしたら、ログイン画面は飛ばして本画面にリダイレクトする
  if (currentUser) {
    return (
      <Navigate to='/' replace />
    );
  }

  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <h2 className='auth-title'>Notionクローン</h2>
        <div className='auth-form-container'>
          <div className='auth-card'>
            <div className='auth-form'>
              <div>
                <label className='auth-label' htmlFor='username'>
                  ユーザー名
                </label>
                <div className='auth-input-container'>
                  <input
                    // 双方向バインディング
                    value={name} // データ -> 画面表示 (ユーザ入力以外でnameが更新されても、即座に画面表示に反映される)
                    onChange={(e) => setName(e.target.value)} // 画面表示 -> データ（入力値が即座に変数`name`に反映される）
                    id='username'
                    name='username'
                    placeholder='ユーザー名'
                    required
                    type='text'
                    className='input-auth'
                  />
                </div>
              </div>
              <div>
                <label className='auth-label' htmlFor='email'>
                  メールアドレス
                </label>
                <div className='auth-input-container'>
                  <input
                    // 双方向バインディング
                    value={email} // データ -> 画面表示 (ユーザ入力以外でemailが更新されても、即座に画面表示に反映される)
                    onChange={(e) => setEmail(e.target.value)} // 画面表示 -> データ（入力値が即座に変数`email`に反映される）
                    id='email'
                    name='email'
                    placeholder='メールアドレス'
                    required
                    type='email'
                    className='input-auth'
                  />
                </div>
              </div>
              <div>
                <label className='auth-label' htmlFor='password'>
                  パスワード
                </label>
                <div className='auth-input-container'>
                  <input
                    // 双方向バインディング
                    value={password} // データ -> 画面表示 (ユーザ入力以外でpasswordが更新されても、即座に画面表示に反映される)
                    onChange={(e) => setPassword(e.target.value)} // 画面表示 -> データ（入力値が即座に変数`password`に反映される）
                    id='password'
                    name='password'
                    placeholder='パスワード'
                    required
                    type='password'
                    className='input-auth'
                  />
                </div>
              </div>
              <div>
                <button
                  disabled={!name || !email || !password || isSubmitting}
                  onClick={signup} // ReactはPromiseオブジェクトを無視するのawait不要
                  className='home-button'
                  style={{ width: '100%' }}
                >
                  登録
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
