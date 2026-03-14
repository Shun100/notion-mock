import { useState } from "react";
import type { Note } from "../modules/notes/note.entity";

/*
 * ノート詳細画面のタイトル部分
 */

type Props = {
  initialData: Note;
  onTitleChange: (valuse: string) => void;
}

export default function TitleInput({ initialData, onTitleChange }: Props) {
  const [value, setValue] = useState(initialData.title ?? '無題');

  return (
    <div className='title-input-container'>
      <textarea
        className='title-input'
        value={value}
        onChange={e => {
          setValue(e.target.value);
          onTitleChange(e.target.value);
        }}
      />
    </div>
  );
}
