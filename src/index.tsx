import { set, get } from 'idb-keyval';
import './index.css';
import App from './App';
import { createDB } from './serviceWorker';
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App/>)


// createDB();

// async function testIDBKeyval() {
//     await set('hello', 'world');
//     const whatDoWeHave = await get('hello');
//     console.log(`When we queried idb-keyval for 'hello', we found: ${whatDoWeHave}`);
// }

// testIDBKeyval();