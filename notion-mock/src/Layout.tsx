import SideBar from './components/SideBar';
import SearchModal from './components/SearchModal';
import './styles/layout.css';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { currentUserAtom } from './modules/auth/current-user.state';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNoteStore } from './modules/notes/notes.state';
import { noteRepository } from './modules/notes/note.repository';
import type { Note } from './modules/notes/note.entity';

// ホーム画面とノート詳細画面の共通部品
export default function Layout() {
  const currentUser = useAtomValue(currentUserAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [searchResult, setSearchResult] = useState<Note[]>([]);
  const noteStore = useNoteStore();
  const navigate = useNavigate();

  /**
   * ノート検索 (キーワード検索)
   * @param { string } keyword
   */
  const searchNotes = async (keyword: string) => {
    const notes = await noteRepository.find({ keyword });
    noteStore.set(notes);
    setSearchResult(notes ?? []);
  }

  const moveToDetail = (noteId: number) => {
    navigate(`/notes/${noteId}`);
    setIsShowModal(false);
  }

  useEffect(() => {
    /**
     * ノート一覧取得
     */
    const fetchNotes = async () => {
      setIsLoading(true);
      const notes: Note[] = await noteRepository.find();
      noteStore.set(notes); // 画面の裏で持つ情報にセット
      setIsLoading(false);
    }
    fetchNotes();
  }, []); // 第2引数が空だと、ページロード時に一度だけ実行される

  if (!currentUser) {
    // 未ログインの状態でホーム画面やノート詳細画面のURLにアクセスしたら、サインイン画面にリダイレクトする
    return (
      <Navigate to='/signin' replace />
    );
  }

  return (
    <div className='layout-container'>
      {/* ページの非ロード中のみサイドバーを表示 */}
      {!isLoading && <SideBar onSearchButtonClick={() => setIsShowModal(true)}/>}
      <main className='layout-main'>
        <Outlet />
      </main>
      <SearchModal
        isOpen={isShowModal}
        onClose={() => setIsShowModal(false)}
        notes={searchResult}
        onKeywordChange={searchNotes}
        onItemSelect={moveToDetail}
      />
    </div>
  );
}