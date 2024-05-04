import { useState } from 'react'
import './App.css'
import { openDB } from 'idb'


function App() {
  const [results, setResults] = useState<any[] | null>(null)

function getDB() {
  return openDB('bands', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
       const store = db.createObjectStore('images', {
        autoIncrement: true,
       })
       store.createIndex('image', 'image')
   }
  })
}

async function getData() {
  const db = await getDB()
  const tx = await db.transaction('images', 'readonly')
  const store = tx.objectStore('images')
  const value = await store.getAll() || []
  setResults(value)
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
  const db = await getDB()
  try {
    const tx = await db.transaction('images', 'readwrite')
    const store = tx.objectStore('images')
    await store.add(data)
    await tx.commit
    getData()
  } catch (e) {
    console.log(e)
  }
}
  if (window.matchMedia('(display-mode: standalone)').matches) {
    getData()
    return (
      <div className="App">
        <div className="container">
          <input
            type="file"
            name="myImage"
            onChange={(event) => handleImageUpload(event)}
            ></input><br/>
            { results !== null ? results.map((image, index) =>
                <img width={200} height={200} src={image} key={index}></img>
              ) : 'Nenhuma imagem foi carregada'
            }
        </div>
      </div>
    )
  } else {
    return (
      <div className="App">
        INSTRUÇÃO PARA ADICIONAR O APP A TELA INICIAL
      </div>
    )
  }
}

export default App
