import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Layout from "./Layout";
import Home from "./pages/Home";
import NoteDetail from "./pages/NoteDetail";
import { useSetAtom } from "jotai";
import { authRepository } from "./modules/auth/auth.repository";
import { useEffect, useState } from "react";
import { currentUserAtom } from "./modules/auth/current-user.state";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const setCurrentUser = useSetAtom(currentUserAtom);

  useEffect(() => {
    fetchCurrentUser();
  }, []); // 第2引数に空配列を渡すと、ページロード時の1回だけ第1引数のコールバック処理を実行する

  const fetchCurrentUser = async () => {
    try {
      const user = await authRepository.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading) {
    return <div />;
  }

  return (
    <BrowserRouter> {/* ルーティング設定 */}
      <div className="app-conatiner">
        <Routes> {/* URLとページの対応を記述 */}
          {/* サインインページ */}
          <Route path='/signin' element={<Signin />} />

          {/* サインアップページ */}
          <Route path='/signup' element={<Signup />} />
          
          {/* 各ページ */}
          <Route path='/' element={<Layout />}> {/* Layoutコンポーネントを流用する */}
            {/* ホーム画面 */}
            {/* indexと書くと、親のURLをそのまま使用する ここでは'/'になる */}
            <Route index element={<Home />}/>

            {/* 例. /hogeにアクセスすると、Layout.tsxのOutletコンポーネントがHogeコンポーネントに置き換わって描画される */}
            {/* <Route path='/hoge' element={<Hoge />}/> */}

            {/* ノート詳細ページ :idは動的ルート */}
            <Route path="/notes/:id" element={<NoteDetail />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
