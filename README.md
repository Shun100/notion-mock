# notion-mock

## 実行環境

- `Node.js v20.18.0`

## VS Codeのプラグイン

- `ES7 + React/Redux/GraphQL/React-Native snippets`
  - Reactのコードを自動補完してくれる
- `Auto Close Tag`
  - HTMLの閉じタグを自動補完してくれる
- `Auto Rename Tag`
  - HTMLのタグを変更すると閉じタグも自動的に変更してくれる
- `Prettier - Code formatter`
  - コードのフォーマットを補正してくれる
  - `Settings -> Editor: Format On Save`を有効にすると保存時に補正してくれる
- `Mithril Emmet`
  - HTMLの省略記法が使えるようになる

## プロジェクトのセットアップ

```bash
  npm crate vite@latest // プロジェクトの作成
  cd notion-mock
  npm install
  npm run dev // viteサーバの起動確認

  // 一度サーバを終了した後に実行
  npm install react-router-dom react-icons cmdk
  npm axios // Fetch同様にPromiseオブジェクトベースだが、こちらの方がAPI管理・認証・共通設定機能が充実している
  npm install jotai // globalState管理用
  npm install @blocknote/core @blocknote/react @blocknote/mantine // ノート本文の更新用
  npm install use-debounce
```

## Reactの基本知識

- `useState`
  - 関数コンポーネントで状態を持たせるためのフック
  - 画面表示と裏で保持するデータの同期が容易になる

  ```TypeScript
    // 基本的な使い方
    import { useState } from 'react';

    function Counter() {
      const [count, setCount] = useState(0); // 初期値0

      return (
        <div>
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>
      );
    }
  ```

- `globalState`
  - アプリケーション全体で共有される状態のこと
  - 通常の`useState`はコンポーネント内でだけで使われるが、`globalState`は複数のコンポーネント間で共通して使える状態管理を指す
    - 共有のためのバケツリレーが不要になるのでコードの見通しや保守性が向上する
  - 画面をリロードしたりブラウザを閉じたらクリアされてしまうので注意

  ```TypeScript
    // 定義する側
    const UserContext = React.createContext();

    function App() {
      const [user, setUser] = useState(null);

      return (
        <UserContext.Provider value=({ user, setUser })>
          <Header />
        </UserContext.Provider>
      );
    }

    // 使う側
    const { user } = useContext(UserContext);
  ```

- `useEffect`
  - Reactコンポーネントで副作用を扱うためのフック
  - 副作用とは
    - 画面の描画処理以外の処理のこと (コンポーネントの外部状態を変更する処理)
      - API通信
      - タイマー (`setTimeout`/`setInterval`)
      - イベントリスナー登録
      - localStorageアクセス
      - DOM操作

  ```TypeScript
    /**
     * Reactは
     * 1. 描画(render)
     * 2. DOM反映
     * 3. useEffect実行
     * という流れで動く
     * つまり、useEffectには「描画が終わった後に実行したい処理」を記述する
     *
     * 第2引数について
     * - 引数なし: ページロードの度に実行
     * - 空配列: 初回ページロード時に1回だけ実行
     * - 空以外: 値が変わる度に実行
     */
    useEffect(() => {
      // 副作用の処理
    }, [依存配列]);
  ```

- `Props`
  - Reactのコンポーネントは「関数のように引数を受け取る」

    ```TypeScript
      function NoteItem({ note }: Props) { ... }
    ```

    - `{ note }`が関数の引数
    - 外部から渡されるデータのことを`props`と呼ぶ
    - ReactではHTML属性のように`<NoteItem note={note} />`で表す

  - TypeScriptでPropsをinterfaceで書く理由
    - JavaScriptだけでは型が無く、例えばこう書くと危険

    ```TypeScript
      <NoteItem note={123} /> // noteはNote型ではない
    ```

    - 一方、TypeScriptでinterfaceを定義すると

      ```TypeScript
        interface Props {
          note: Note;
        }
      ```

      - noteの型は`Note`であると明示される
      - もし間違った型を渡すとコンパイルエラーになる

  - interfaceの代わりにtypeでもOK
    - TypeScriptではinterfaceとtypeどちらでもPropsを定義できる

      ```TypeScript
        // interface
        interface Props {
          note: Note;
        }

        // type
        type Props = {
          note: Note;
        }
      ```

      - 違いはほとんど無いが、interfaceは拡張しやすく、typeはユニオン型やジェネリクスと親和性がある

- `useNavigate`
  - React Routerにあるページ遷移(ナビゲーション)をプログラムから行うためのフック
  - ボタンのクリックや処理の完了後など、コードから別のページへ移動したいときに使う

  - 1. 基本の使い方

    ```TypeScript
      import { useNavigate } from 'react-router-dom';

      function Home() {
        const navigate = useNavigate();

        const goToAbout = () => {
          navigate('/about');
        };

        return (
          <button onClick={goToAbout}>
            Aboutページへ
          </button>
        );
      }
    ```

  - 2. よくある使い方
    - 2-1. クリックでページ遷移
    - 2-2. ログイン後にページ遷移
    - 2-3. 戻る・進む
      ```TypeScript
        navigate(-1); // 戻る
        navigate(1); // 進む
      ```
    - 2-4. 履歴を書き換える
      - ログイン後にブラウザバックで、ホーム画面に戻らないようにする等
      ```TypeScript
        navigete('/home', { replace: true });
      ```
    - 2-5. stateを渡す

      ```TypeScript
        // 渡す側
        navigate('/profile', { state: { userId: 123 }});

        // 受け取る側
        import { useLocation } from 'react-router-dom';

        const location = useLocation();
        console.log(location.state.userId);
      ```

- コンポーネント
  - Layoutコンポーネント
    - 全てのページで共通して表示される外枠部分（例. サイドバー）
  - Outletコンポーネント
    - URLに応じて中身が入れ替わるコンテンツ部分

## その他に必要な知識

- ユーザ認証
  - 本アプリでは「Bearer Token」認証認可方式を使用している
    - 1. トークンが正しいか？ -> Authentication (本人確認)
    - 2. そのユーザは何ができるか？ -> Authorization (権限確認)

  ```mermaid
    sequenceDiagram
    participant U as User
    participant C as Client (Browser / SPA)
    participant S as Server (API)

    U->>C: ログイン情報入力
    C->>S: POST /login (id, password)
    S->>S: 資格情報検証（Authentication）
    alt 認証失敗
        S-->>C: 401 Unauthorized
    else 認証成功
        S-->>C: 200 OK + Access Token 発行
    end

    C->>C: トークン保存

    C->>S: GET /protected\nAuthorization: Bearer <token>

    S->>S: トークン検証（Authentication）
    alt トークンなし / 無効 / 期限切れ
        S-->>C: 401 Unauthorized
    else トークン有効
        S->>S: 権限チェック（Authorization）
        alt 権限なし
            S-->>C: 403 Forbidden
        else 権限あり
            S-->>C: 200 OK + データ返却
        end
    end
  ```

## メモ

- 2026-03-08
  - 削除処理の仕組み
    - `modules/notes/note.repository.ts`に、**サーバにノートの削除をリクエストする処理**を記述
    - `modules/notes/notes.stats.ts`に、**画面の裏で保持するデータからノートを削除する処理**を記述
    - `components/NoteList/index.tsx`に、**マウスクリックを検知して上記2つの処理を呼び出す処理**を記述
    - `components/NoteList/NoteItem.tsx`に、**Deleteボタンと上記の処理を紐づける処理**を記述

- 2026-03-11
  - 子ノートの作成とノート一覧への追加処理
    - `modules/notes/note.repository.ts`
      - `create`: ノートをDBに登録する
    - `components/NoteList/index.tsx`: ノート一覧のコンポーネント
      - `createChild`: 子ノートを作成 (DBに登録)し、global stateに子ノートの情報を設定する
      - return句で<NoteItem>にonCreate関数としてcreateChild関数を渡す
    - `components/NoteList/NoteItem.tsx`: ノート一覧中のノート1つのコンポーネント
      - `Props.onCreate`: PropsでonCreate関数を受け取る

- 2026-03-14
  - なぜReactでは関数定義にfunctionを使わず、アロー関数を使うのか
    - `this`の扱いが安全
      - アロー関数は`this`を持たず、外側の`this`をそのまま使うという特徴がある
      - これは`this`が変わらない、すなわちbind不要であるため、以前のクラスコンポーネントで問題になりがちだった`this`バインド問題を回避できる
