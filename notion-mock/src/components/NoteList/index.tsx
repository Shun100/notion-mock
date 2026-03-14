import { useNavigate } from 'react-router-dom';
import type { Note } from '../../modules/notes/note.entity';
import { noteRepository } from '../../modules/notes/note.repository';
import { useNoteStore } from '../../modules/notes/notes.state';
import NoteItem from './NoteItem';
import { useState } from 'react';

type Props = {
  layer?: number;
  parentId: number | null;
}

/**
 * ノート一覧のコンポーネント
 */
export default function NoteList({ layer = 0, parentId = null }: Props) {
  const noteStore = useNoteStore(); // 画面の裏で保持しているノートのデータ
  const notes: Note[] = noteStore.getAll(); // 裏で保持しているデータからノート一覧を取得
  const [isExpanded, setIsExpanded] = useState<Map<number, boolean>>(new Map());
  const navigate = useNavigate(); // JavaScript内で遷移する処理

  const createChild = async (e: React.MouseEvent, parentId: number): Promise<void> => {
    e.preventDefault(); // ＋ボタンがノートの見出し全体に反応してしまうのを防ぐ
    const newNote = await noteRepository.create({ parentId });
    noteStore.set([newNote]);

    moveToDetail(newNote.id); // 詳細画面に遷移
  }

  const fetchChildren = async (e: React.MouseEvent, note: Note): Promise<void> => {
    e.preventDefault();
    const children = await noteRepository.find({ parentId: note.id });
    if (children) {
      noteStore.set(children);
      setIsExpanded((prev) => {
        const newIsExpanded = new Map(prev);
        newIsExpanded.set(note.id, !prev.get(note.id));
        return newIsExpanded;
      });
    }
  }

  const deleteNote = async (e: React.MouseEvent, noteId: number) => {
    try {
      e.preventDefault(); // ノートの編集・詳細の表示処理が動かないようにする
      await noteRepository.delete(noteId);
      noteStore.delete(noteId);
      // navigate('/');
    } catch (error) {
      console.error(error);
      alert('ノートの削除に失敗しました');
    }
  };

  const moveToDetail = (noteId: number) => {
    navigate(`/notes/${noteId}`);
  };
  
  return (
    <>
      {/* ノートの数だけ描画 */}
      {/**
        * 混乱しやすいポイント
        * NoteItemは引数を2つ(key, note)受け取っているように見えるが、
        * 引数は1つ(Props)であり、受け取ったPropsオブジェクトに対するキーの指定をHTML属性のように記述できる
        */}
      {notes
        .filter(note => note.parentId === parentId)
        .map((note: Note) => (
          <div key={note.id}>
            <NoteItem
              key={note.id}
              note={note}
              onClick={() => moveToDetail(note.id)}
              onCreate={(e) => createChild(e, note.id)}
              onExpand={(e) => fetchChildren(e, note)}
              onDelete={(e) => deleteNote(e, note.id)}
              layer={layer}
              isExpanded={isExpanded.get(note.id)}
            />
            {isExpanded.get(note.id) && (
              <NoteList layer={layer + 1} parentId={note.id} />
            )}
          </div>
      ))}
    </>
  );
}
