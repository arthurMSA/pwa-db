import { openDB } from 'idb';

export async function createDB() {
  const db = await openDB('cookbook', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
    switch(oldVersion) {
     case 0:
     case 1:
       const store = db.createObjectStore('recipes', {
           autoIncrement: true,
           keyPath: 'id'
       });
       store.createIndex('type', 'type');
     }
   }
  });
}