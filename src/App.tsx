import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { next as A } from "@automerge/automerge";
import {
  useBootstrap,
  useDocument,
} from "@automerge/automerge-repo-react-hooks";

interface CounterDoc {
  counter: A.Counter;
  list: Array<string>;
  myObject: Record<string, string>;
}

function App() {
  // Setup document here
  // TODO: Key should make sure everyone gets same document
  const { url } = useBootstrap({
    onNoDocument: (repo) => {
      // We create our empty document with our defined state
      const handle = repo.create<CounterDoc>();
      // Set initial values
      handle.change((d) => {
        d.counter = new A.Counter();
        d.list = [];
        d.myObject = {};
      });
      return handle;
    },
  });

  const [doc, changeDoc] = useDocument<CounterDoc>(url);

  // Checkout the awareness hooks as well
  // https://github.com/automerge/automerge-repo/tree/main/packages/automerge-repo-react-hooks

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => changeDoc((d) => d.counter.increment(1))}>
          count is {doc && doc.counter.value}
        </button>
        <button onClick={() => changeDoc((d) => d.list.push("a"))}>
          Add to list
        </button>
        <button
          onClick={() =>
            changeDoc((d) => {
              console.log(d.myObject);
              const length = Object.keys(d.myObject).length;
              d.myObject[`z-${length}`] = length.toString();
            })
          }
        >
          Expand object
        </button>
        <p>{doc && JSON.stringify(doc.myObject)}</p>
        {doc && doc.list.map((el, i) => <p key={i}>{el}</p>)}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
