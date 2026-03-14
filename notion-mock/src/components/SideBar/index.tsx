import Item from './Item';
import NoteList from '../NoteList';
import UserItem from './UserItem';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useNoteStore } from '../../modules/notes/notes.state';
import { noteRepository } from '../../modules/notes/note.repository';
import { useNavigate } from 'react-router-dom';

type Props = {
  onSearchButtonClick: () => void;
}

/*
 * サイドバー全体のコンポーネント
 */
export default function SideBar({ onSearchButtonClick }: Props) {
  const noteStore = useNoteStore();
  const navigate = useNavigate();

  const createNote = async () => {
    try {
      const newNote = await noteRepository.create({}); // タイトルは無し
      noteStore.set([newNote]);
      navigate(`/notes/${newNote.id}`);
    } catch (error) {
      console.error(error);
      alert('ノートの作成に失敗しました');
    }
  }
  return (
    <>
      <aside className='sidebar'>
        <div>
          <div>
            <UserItem />
            <Item
              label='検索'
              icon={FiSearch}
              onClick={onSearchButtonClick}
            />
          </div>
          <div className='sidebar-spacer'>
            <NoteList /> {/* ノート一覧 */}
            <Item label='ノートを作成' icon={FiPlus} onClick={createNote} />
          </div>
        </div>
      </aside>
      <div className='sidebar-placeholder'></div>
    </>
  );
}
