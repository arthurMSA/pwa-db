import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { IDBPDatabase, openDB } from 'idb'


function App() {
  const [beatleName, setBeatleName] = useState('')
  const [results, setResults] = useState([''])
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  let db: IDBPDatabase;

function showResult(str: string) {
  console.log(str)
}

async function createDB() {
  // Using https://github.com/jakearchibald/idb
  try {
    db = await openDB('bands', 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
         const store = db.createObjectStore('beatles', {
          autoIncrement: true,
         });
         store.createIndex('age', 'age');
         showResult("Database and Data store created");
     }
    });
    showResult("Database opened.");
  } catch (e) {
    console.log(e)
  }
}

async function getData() {
    if (db==undefined) {
      showResult("Database is closed");
      return;
    }
  
  const tx = await db.transaction('beatles', 'readonly')
  const store = tx.objectStore('beatles');
  const value = await store.getAll() || []
  setResults(value)
  if (value) {
    showResult("Data from DB: " + JSON.stringify(value))
  } else {
    showResult("There is no beatle with such name in store")
  }
}

function handleImageUpload(event: any) {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = async (readerEvenet: any) => {
    const imageData: any = readerEvenet.target.result
    await addData(imageData)
  }
  reader.readAsDataURL(file)
}

async function addData(data: any) {
  if (db==undefined) {
    showResult("Database is closed")
    return;
  }  
  try {     
    const beatle = {
      name: beatleName,
      nickname: 'The number 1',
      age: 58,
    };
        
    const tx = await db.transaction('beatles', 'readwrite');
    
    // Check first if the key already exists in store
    const store = tx.objectStore('beatles');
    // const beatleInStore = await store.get(beatleName)
    // if (beatleInStore) {
    //   showResult("Beatle is already in store");
    //   return;
    // }
    // The key doesn't exist, so we add it to the store
    console.log(data)
    await store.add(data);
    await tx.commit;
    showResult("Beatle added to the database");

  } catch (e) {
    console.log(e)
    showResult("Error while saving data to DB: ")
  }
}
  return (
    <div className="App">
      <div className="container">
      <h1>
        IndexedDB
      </h1>
      <p className="instructions">
        Check within your browser developer tools IndexedDB contents.
      </p>
      <label>Beatle name
        <input id="beatleName" placeholder="Enter a beatle name" onChange={(event) => setBeatleName(event.target.value)}/>
      </label>

      
      <section className="toolbar">
        <button id="create" onClick={createDB}>Open Database</button>
        <button id="save" onClick={addData}>Save Beatle</button>
        <button id="get" onClick={getData}>Get Beatle</button>
        <button id="delete">Delete Beatle</button>
      </section>
      <input
        type="file"
        name="myImage"
        onChange={(event) => handleImageUpload(event)}
        ></input><br/>
        <img src={results[1]}></img>
    </div>
    </div>
  );
}

export default App;
