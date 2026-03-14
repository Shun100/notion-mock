import api from "../../lib/api";
import { Note } from "./note.entity";

export const noteRepository = {
  async create(params: { title?: string, parentId?: number }): Promise<Note> {
    const result = await api.post('/notes', {
      title: params.title,
      parentId: params.parentId,
    });
    return new Note(result.data);
  },

  async find(options?: { parentId?: number, keyword?: string }): Promise<Note[]> {
    // クエリパラメータはキーがparamsのオブジェクトとして記述する
    const result = await api.get('/notes', {
      params: {
        parentId: options?.parentId,
        keyword: options?.keyword,
      }
    });
    return result.data.notes.map((note: Note) => new Note(note));
  },

  async findOne(id: number): Promise<Note> {
    const result = await api.get(`/notes/${id}`);
    return new Note(result.data);
  },

  async update(id: number, note: { title?: string; content?: string }): Promise<Note> {
    const result = await api.patch(`/notes/${id}`, note);
    return new Note(result.data);
  },

  /**
   * ノート削除 子ノートも削除される
   * @param {number} id - 削除するノートのID
   * @returns {Promise<boolean>} - 削除成否
   */
  async delete(id: number): Promise<boolean> {
    await api.delete(`/notes/${id}`);
    return true;
  },
}