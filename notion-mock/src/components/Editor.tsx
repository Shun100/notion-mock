import { ja } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import '@blocknote/mantine/style.css';

type Props = {
  initialContent: string;
  onContentChange: (content: string) => void;
}

/*
 * ノート詳細画面のノート部分
 */
export function Editor({ initialContent, onContentChange }: Props ) {
  const editor = useCreateBlockNote({
      dictionary: ja,
      initialContent: JSON.parse(initialContent),
    });
  
  return (
    <div>
      <BlockNoteView
        editor={editor}
        onChange={() => onContentChange(JSON.stringify(editor.document))}
      />
    </div>
  );
}