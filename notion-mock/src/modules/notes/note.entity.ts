export class Note {
  id!: number;
  userId!: string;
  title?: string | null;
  content?: string | null;
  parentId?: number | null; // ノートの下にノートを紐づけられる設計のため、親ノートのIDが必要
  createdAt!: Date;

  constructor(data: Note) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt);
  }
}