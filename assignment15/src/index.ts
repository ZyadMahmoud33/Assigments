import { User } from "./User";
import { Admin } from "./Admin";
import { Note } from "./Note";
import { NoteBook } from "./NoteBook";
import { Storage } from "./Storage";

// regular user
const user1 = new User(1, "Zyad", "zyad@example.com", "12345", "0100000000", 22);
user1.displayInfo();

// admin (inheritance)
const admin1 = new Admin(2, "Sara", "sara@example.com", "admin123", "0111111111", 30);
admin1.displayInfo();

// notes
const note1 = new Note(1, "Shopping List", "Buy milk, eggs and bread", user1.getId());
const note2 = new Note(2, "Meeting Notes", "Discuss the new project timeline with the team", user1.getId());

console.log(note1.preview());
console.log(note2.preview());

// notebook (composition with Note)
const notebook1 = new NoteBook(1, "Personal Notes");
notebook1.addNote(note1);
notebook1.addNote(note2);
console.log("notes in notebook1:", notebook1.getNotes().length);

// aggregation: user owns a notebook, but the notebook can exist on its own
user1.addNotebook(notebook1);
console.log("notebooks owned by user1:", user1.getNotebooks().length);

// admin managing notes inside a notebook
const note3 = new Note(3, "Ideas", "Build a mobile app for note taking", user1.getId());
admin1.manageNotes(notebook1, "add", note3);
admin1.manageNotes(notebook1, "remove", note1);
console.log("notes in notebook1 after admin actions:", notebook1.getNotes().length);

// generic storage, works with any type
const noteStorage = new Storage<Note>();
noteStorage.addItem(note1);
noteStorage.addItem(note2);
console.log("items in noteStorage:", noteStorage.getAllItems().length);

const numberStorage = new Storage<number>();
numberStorage.addItem(10);
numberStorage.addItem(20);
console.log("items in numberStorage:", numberStorage.getAllItems());
