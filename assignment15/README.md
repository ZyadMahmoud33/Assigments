# Assignment 15 - Notes Management System (TypeScript OOP)

## How to run
npm install
npm start   -> runs src/index.ts with ts-node
npm run build -> compiles to dist/

## Files
- src/User.ts       base class
- src/Admin.ts       extends User (inheritance)
- src/Note.ts         a single note
- src/NoteBook.ts   holds Notes (composition)
- src/Storage.ts    generic class, Storage<T>
- src/index.ts        demo that wires everything together
- class-diagram.svg  UML class diagram (Part B)

## Relationships (Part B - question 2)

- Inheritance: Admin extends User. Admin gets everything User has, plus
  its own manageNotes() method.

- Composition: NoteBook "owns" its Notes. A Note only makes sense as
  part of a notebook, notes are added/removed through addNote() /
  removeNote() on the NoteBook itself.

- Aggregation: User has notebooks (addNotebook()), but doesn't create
  them, and a notebook can keep existing even if the user is removed.
  Weaker relationship than composition.

- Association: Note stores userId, a reference to the User who wrote
  it (the author). Neither class owns the other.

- Generics: Storage<T> can hold any type - used in the demo with both
  Storage<Note> and Storage<number>.
