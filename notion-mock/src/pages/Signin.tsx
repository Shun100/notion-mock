import { useState } from 'react';
import '../styles/pages/auth.css';
import { authRepository } from '../modules/auth/auth.repository';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../modules/auth/current-user.state';
import { Navigate } from 'react-router-dom';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [isSubmitting, setIsSubmitting] = useState(false); // APIとの通信中

  const signin = async () => {
    setIsSubmitting(true);
    try {
      const {user, token} = await authRepository.signin(email, password);
      setCurrentUser(user); // ログイン中のユーザに設定

      // Local Storageにユーザ情報を保存
      localStorage.setItem('token', token);
    } catch (error) {
      console.error(error);
      alert('ログインに失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ログイン済みの状態でサインイン画面のURLにアクセスしたら、ログイン画面は飛ばして本画面にリダイレクトする
  if (currentUser) {
    return (
      // Navigate: React Router DOMのコンポーネント
      <Navigate to="/" replace />
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
                <label className='auth-label' htmlFor='email'>
                  メールアドレス
                </label>
                <div className='auth-input-container'>
                  <input
                    // 双方向バインド
                    value={email} // データ -> 表示
                    onChange={e => setEmail(e.target.value)} // 表示 -> データ
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
                    // 双方向バインド
                    value={password} // データ -> 表示
                    onChange={e => setPassword(e.target.value)} // 表示 -> データ
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
                  onClick={signin}
                  disabled={!email || !password || isSubmitting}
                  className='home-button'
                  style={{ width: '100%' }}
                >
                  ログイン
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
