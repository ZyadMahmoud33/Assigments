import { User } from "./User";
import { NoteBook } from "./NoteBook";
import { Note } from "./Note";

// Inheritance: Admin is a User, plus it gets extra powers to manage
// notes inside a notebook (add/remove on behalf of any user).
export class Admin extends User {
  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number
  ) {
    super(id, name, email, password, phone, age);
  }

  manageNotes(notebook: NoteBook, action: "add" | "remove", note: Note): void {
    if (action === "add") {
      notebook.addNote(note);
      console.log(`admin added note #${note.getId()} to notebook #${notebook.getId()}`);
    } else {
      notebook.removeNote(note.getId());
      console.log(`admin removed note #${note.getId()} from notebook #${notebook.getId()}`);
    }
  }
}
