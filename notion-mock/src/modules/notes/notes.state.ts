import { atom, useAtom } from "jotai";
import { Note } from "./note.entity";

const notesAtom = atom<Note []>([]);

const distinctById = (combinedNotes: Note[]): Note[] => {
  const idToNote = new Map(combinedNotes.map(note => [note.id, note]));
  const uniqueNotes = [...idToNote.values()];
  return uniqueNotes; 
}

// 汎用化するとこうなる
const distinctBy = <T>(notes: Note[], getIdentifier: (note: Note) => T): Note[] => {
  const map = new Map(notes.map(note => [getIdentifier(note), note]));
  const uniqueNotes = [...map.values()];
  return uniqueNotes;
}

export const useNoteStore = () => {
  const [notes, setNotes] = useAtom(notesAtom);
  
  const getAll = () => notes;

  const set = (newNotes: Note[]) => {
    // 更新処理 setNotesメソッドにコールバックで更新処理を渡す
    setNotes((oldNotes: Note[]) => {
      const combinedNotes = [...oldNotes, ...newNotes];
      // return distinctById(combinedNotes);
      return distinctBy(combinedNotes, note => note.id);
    });
  };

  const getOne = (id: number) => notes.find(note => note.id === id);

  const deleteNote = (id: number) => {
    const findChildrenIds = (parentId: number): number[] => {
      const childrenIds = notes
        .filter((note: Note) => note.parentId == parentId)
        .map(child => child.id);
        
      // 再帰的に処理して都度連結(concat)する
      return childrenIds.concat(...childrenIds.map(childId => findChildrenIds(childId)));
    };

    // 削除処理 setNotesメソッドにコールバックで削除処理を渡す
    setNotes(notes => notes.filter(note => ![id, ...findChildrenIds(id)].includes(note.id)));
  };

  const clear = () => setNotes([]);

  return { getAll, set, getOne, delete: deleteNote, clear };
};