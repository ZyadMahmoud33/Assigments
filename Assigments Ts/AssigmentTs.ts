// 1. اليوزر كلاس
class User {
  id: any;
  name: any;
  email: any;
  password: any;
  phone: any;
  age: any;

  constructor(id: number, name: string, email: string, password: string, phone: string, age: number) {
    this.id = id;
    this.name = name;  // اصلحتها كانت String غلط
    this.email = email; // اصلحتها
    this.password = password;
    this.phone = phone;
    
    // عشان انا مش عايز السن يقل عن 18 او يزيد عن 60
    if(age >= 18 && age <= 60) {
      this.age = age;
    } else {
      console.log("السن مش مظبوط");
      this.age = null;
    }
  }

  displayInfo() {
    console.log("ID: " + this.id);
    console.log("Name: " + this.name);
    console.log("Email: " + this.email);
    console.log("Phone: " + this.phone);
    console.log("Age: " + this.age);
    console.log("-----------------");
  }
}

// 2. ادمن بيورث من اليوزر
class Admin extends User {
  type: any;

  constructor(id: number, name: string, email: string, password: string, phone: string, age: number) {
    super(id, name, email, password, phone, age);
    this.type = "admin";
  }

  manageNotes() {
    console.log(this.name + " بيدير النوتات");
    // كان نفسي اعمل حاجة هنا بس مش عارف اعمل اية
  }
}

// 3. كلاس النوتة
class Note {
  id: any;
  title: any;
  content: any;
  userId: any;

  constructor(id: number, title: string, content: string, userId: number) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.userId = userId;
  }

  // بتجيب اول 15 حرف من المحتوي
  preview() {
    let short = this.content.substring(0, 15);
    if(this.content.length > 15) {
      return short + "...";
    }
    return short;
  }
}

// 4. النوت بوك - composition
class NoteBook {
  id: any;
  name: any;
  notesList: any[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.notesList = []; // هنا هخزن النوتات
  }

  addNote(noteObj: Note) {
    // لو النوتة مش نوتة حقيقية مش هضيفها
    if(noteObj && noteObj.constructor && noteObj.constructor.name === "Note") {
      this.notesList.push(noteObj);
      console.log("تم اضافة " + noteObj.title);
    } else {
      console.log("دي مش نوتة بجد");
    }
  }

  removeNote(noteIdToRemove: number) {
    for(let i = 0; i < this.notesList.length; i++) {
      if(this.notesList[i].id === noteIdToRemove) {
        let removedNote = this.notesList.splice(i, 1);
        console.log("تم مسح: " + removedNote[0].title);
        return;
      }
    }
    console.log("مش لاقي النوتة دي");
  }

  getAllNotes() {
    return this.notesList;
  }

  // عشان اشوف كل النوتات
  showAllNotes() {
    for(let i = 0; i < this.notesList.length; i++) {
      console.log(this.notesList[i].title + " -> " + this.notesList[i].preview());
    }
  }
}

// 5. يوزر مع نوت بوكس - aggregation
class UserWithNotebooks {
  id: any;
  name: any;
  email: any;
  password: any;
  phone: any;
  age: any;
  notebooks: any[];

  constructor(id: number, name: string, email: string, password: string, phone: string, age: number) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    
    if(age >= 18 && age <= 60) {
      this.age = age;
    } else {
      console.log("سن غلط");
      this.age = null;
    }
    
    this.notebooks = []; // هجمع فيهم النوت بوكس
  }

  displayInfo() {
    console.log("Name: " + this.name);
    console.log("Email: " + this.email);
  }

  addNotebook(notebookObj: NoteBook) {
    // اتأكد انه نوت بوك
    if(notebookObj && notebookObj.constructor && notebookObj.constructor.name === "NoteBook") {
      this.notebooks.push(notebookObj);
      console.log("تم اضافة نوت بوك: " + notebookObj.name);
    } else {
      console.log("دي مش نوت بوك");
    }
  }

  showMeMyNotebooks() {
    for(let i = 0; i < this.notebooks.length; i++) {
      console.log((i+1) + "- " + this.notebooks[i].name);
      if(this.notebooks[i].showAllNotes) {
        this.notebooks[i].showAllNotes();
      }
    }
  }
}

// 6. نوتة مع يوزر - association
class AssociatedNote {
  id: any;
  title: any;
  content: any;
  author: any;

  constructor(id: number, title: string, content: string, authorUser: User) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = authorUser;
  }

  getAuthorName() {
    if(this.author && this.author.name) {
      return this.author.name;
    }
    return "مش معروف";
  }

  preview() {
    let short = this.content.substring(0, 15);
    if(this.content.length > 15) {
      return short + "...";
    }
    return short;
  }
}

// 7. generic storage - اي حاجة تتخزن
class StorageBox {
  allItems: any[];

  constructor() {
    this.allItems = [];
  }

  add(item: any) {
    this.allItems.push(item);
    console.log("اتضافت حاجة جديدة");
  }

  remove(itemId: number) {
    for(let i = 0; i < this.allItems.length; i++) {
      if(this.allItems[i].id === itemId) {
        this.allItems.splice(i, 1);
        console.log("تم مسك العنصر رقم " + itemId);
        break;
      }
    }
  }

  getAll() {
    return this.allItems;
  }

  printAllIds() {
    for(let i = 0; i < this.allItems.length; i++) {
      if(this.allItems[i].id) {
        console.log("id: " + this.allItems[i].id);
      } else {
        console.log("id: مش موجود");
      }
    }
  }
}


let user1 = new User(1, "كريم", "kareem@test.com", "123", "0100", 22);
user1.displayInfo();

let admin1 = new Admin(2, "منة", "mena@test.com", "admin", "0111", 30);
admin1.displayInfo();
admin1.manageNotes();

let note1 = new Note(1, "تسوق", "النوتة دي بتتكلم عن حوار التسوق", user1.id);
let note2 = new Note(2, "سفر", "الكلام هنا عن السفر", user1.id);

console.log(note1.preview());
console.log(note2.preview());

let myBook = new NoteBook(1, "مذكرات 2024");
myBook.addNote(note1);
myBook.addNote(note2);
myBook.showAllNotes();

myBook.removeNote(1);
myBook.showAllNotes();

let userWithBooks = new UserWithNotebooks(3, "سلمي", "salma@test.com", "pass", "0122", 25);
userWithBooks.addNotebook(myBook);
userWithBooks.showMeMyNotebooks();

let storageThing = new StorageBox();
storageThing.add(note1);
storageThing.add(myBook);
storageThing.add(user1);
storageThing.printAllIds();

let assocNote = new AssociatedNote(3, "ملحوظة", "دي ملحوظة مهمة جدا", user1);
console.log(assocNote.getAuthorName());
console.log(assocNote.preview());


// part B

// 1-B. 
//العلاقات:
//- الوراثة: Admin بياخد من User
//- Composition: NoteBook فيه نوتات كتير، ولو النوت بوك مات النوتات تموت معاه
//- Aggregation: UserWithNotebooks عنده نوت بوكس، بس لو اليوزر مات النوت بوكس يفضلوا موجودين
//- Association: AssociatedNote ليه author من نوع User



//2. 
//Inheritance: Admin extends User
//Composition: NoteBook owns Notes (strong relationship)
//Aggregation: User has Notebooks (weak relationship)
//Association: Note has an author (User)
