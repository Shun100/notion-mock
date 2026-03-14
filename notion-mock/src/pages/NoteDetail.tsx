import { useParams } from 'react-router-dom';
import TitleInput from '../components/TitleInput';
import '../styles/pages/note-detail.css';
import { useEffect, useState } from 'react';
import { useNoteStore } from '../modules/notes/notes.state';
import { noteRepository } from '../modules/notes/note.repository';
import { Editor } from '../components/Editor';
import { useDebouncedCallback } from 'use-debounce';

export default function NoteDetail() {
  /*
   * useParams
   * URLからパラメータを取得する
   * 
   * 今回はURLからノートのIDを取得するために使用する
   * URLは、/notes/:idで定義しており、useParamsを呼び出すとコロンから後ろが取得される
   * - App.tsx
   * <Route path="/notes/:id" element={<NoteDetail />} />
   */
  const params = useParams();

  /*
   * 「!」は非null値アサーション演算子と呼ばれ、
   * TypeScriptに対して、「この値は絶対にnullでもundefinedでもない」と
   * 強制的にコンパイラの型チェックを無視して、値が存在することを宣言する
   */
  const id = Number(params.id);

  const [isLoading, setIsLoading] = useState(false);
  const noteStore = useNoteStore();

  // Reactで言う副作用とは「コンポーネントの外部状態を変更すること」
  // なので、getterは副作用に含まない
  const note = noteStore.getOne(id);

  const updateNote = async (
    id: number,
    note: {title?: string, content?: string }
  ) => {
    const updatedNote = await noteRepository.update(id, note);
    noteStore.set([updatedNote]);
  }

  const debounce = useDebouncedCallback(updateNote, 500);

  useEffect(() => {
    const fetchOne = async () => {
      setIsLoading(true);
      const note = await noteRepository.findOne(id);
      noteStore.set([note]); // setterは副作用に含む
      setIsLoading(false);
    }
    fetchOne();
  }, [id]); // idが変化するたびに呼び出される

  if (isNaN(id)) {
    return <div>Invalid note ID</div>;
  }

  if (isLoading) return <div />;
  if (!note) return <div> note does not exist</div>;

  return (
    <div className="note-detail-container">
      <div className="note-detail-content">
        <TitleInput
          initialData={note}
          onTitleChange={title => debounce(id, { title })}
        />
        <Editor
          initialContent={note.content ?? '""'}
          onContentChange={content => debounce(id, { content })}
        />
      </div>
    </div>
  );
}
