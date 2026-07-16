// Generic class - can store any type of data (notes, users, notebooks,
// or anything else), that's why it's typed with T instead of a fixed type.
export class Storage<T> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(item: T): void {
    this.items = this.items.filter((i) => i !== item);
  }

  getAllItems(): T[] {
    return this.items;
  }
}
