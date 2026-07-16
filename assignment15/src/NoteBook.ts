import { Note } from "./Note";

// Composition: a NoteBook owns its notes. Once you remove a notebook, the
// notes that live inside it don't make sense on their own anymore, so
// they get created and destroyed through the notebook.
export class NoteBook {
  private id: number;
  public name: string;
  private notes: Note[] = [];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  getId(): number {
    return this.id;
  }

  addNote(note: Note): void {
    this.notes.push(note);
  }

  removeNote(noteId: number): void {
    this.notes = this.notes.filter((note) => note.getId() !== noteId);
  }

  getNotes(): Note[] {
    return this.notes;
  }
}
