// entity: DBに登録されるデータの構造や型を定義するためのクラス

export class User {
  // !: 確定代入アサーション 「後で必ず値を代入するので警告を出さないでください」の意味
  id!: string;
  email!: string;
  name!: string;

  // バックエンドのEntityオブジェクトはパスワードも保持するが、セキュリティの観点からフロントには返さない
  // password!: string;

  constructor(data: User) {
    Object.assign(this, data);
  }
}

export default User;