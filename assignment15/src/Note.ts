// A single note. It belongs to a notebook (composition) and is written by
// a user (association - the note just references the user's id, it doesn't
// own the user object).
export class Note {
  private id: number;
  public title: string;
  public content: string;
  private userId: number; // reference to the User who wrote it

  constructor(id: number, title: string, content: string, userId: number) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.userId = userId;
  }

  getId(): number {
    return this.id;
  }

  getUserId(): number {
    return this.userId;
  }

  // returns a short preview of the content, capped at 30 characters
  preview(): string {
    if (this.content.length <= 30) {
      return this.content;
    }
    return this.content.slice(0, 30) + "...";
  }
}
