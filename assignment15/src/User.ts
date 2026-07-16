import { NoteBook } from "./NoteBook";

// Base class of the system. Holds the account/profile info of anyone
// using the notes app.
export class User {
  private id: number;
  public name: string;
  public email: string;
  private password: string;
  protected phone: string;
  private age: number;

  // notebooks that belong to this user (aggregation - the notebook can
  // still exist even if this user gets deleted)
  private notebooks: NoteBook[] = [];

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number
  ) {
    if (age < 18 || age > 60) {
      throw new Error("age must be between 18 and 60");
    }

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.age = age;
  }

  getId(): number {
    return this.id;
  }

  getAge(): number {
    return this.age;
  }

  // password stays private, we don't want to print it out with the rest
  // of the user info
  displayInfo(): void {
    console.log(
      `User #${this.id} - ${this.name} | ${this.email} | phone: ${this.phone} | age: ${this.age}`
    );
  }

  // aggregation: a notebook is not "created" by the user, it just gets
  // attached to it, and it can keep existing even if the user is removed
  addNotebook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }

  getNotebooks(): NoteBook[] {
    return this.notebooks;
  }
}
