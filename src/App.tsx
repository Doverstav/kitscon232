import "./App.css";

import { next as A } from "@automerge/automerge";
import {
  useBootstrap,
  useDocument,
  useLocalAwareness,
  useRemoteAwareness,
} from "@automerge/automerge-repo-react-hooks";

interface Todo {
  id: string;
  task: string;
  done: boolean;
}

interface CounterDoc {
  counter: A.Counter;
  list: Array<string>;
  myObject: Record<string, string>;
  todos: Todo[];
}

interface EphemeralState {
  username: string;
  todosCreated: number;
  todosCompleted: number;
  todosUncompleted: number;
  todosDeleted: number;
}

interface AppProps {
  userId: string;
}

interface ExtendedArray<T> extends Array<T> {
  insertAt(index: number, ...args: T[]): ExtendedArray<T>;
  deleteAt(index: number, numDelete?: number): ExtendedArray<T>;
}

/**
 * TODO
 * MUST:
 * Setup ephemeral state
 *
 * Nice to have
 * Move controls below todo description in mobile
 * Allow editing todos after they have been created?
 * */

function App({ userId }: AppProps) {
  // Setup document here
  // TODO: Key should make sure everyone gets same document
  const handle = useBootstrap({
    onNoDocument: (repo) => {
      // We create our empty document with our defined state
      const handle = repo.create<CounterDoc>();
      // Set initial values
      handle.change((d) => {
        d.todos = [];
      });
      return handle;
    },
  });

  const [doc, changeDoc] = useDocument<CounterDoc>(handle.url);

  // Checkout the awareness hooks as well
  // https://github.com/automerge/automerge-repo/tree/main/packages/automerge-repo-react-hooks
  // TODO How to type this state nicely?
  const [, setLocalState] = useLocalAwareness({
    handle,
    userId,
    initialState: { clicks: 0 },
  });

  const [peerStates] = useRemoteAwareness({
    handle,
    localUserId: userId,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const task = formData.get("task");

    if (task || task !== "") {
      const todo: Todo = {
        id: crypto.randomUUID(),
        task: task as string,
        done: false,
      };

      changeDoc((d) => d.todos.push(todo));
      event.currentTarget.reset();
    }
  };

  return (
    <>
      <h1>ToDo (better title required)</h1>
      <p>
        A collaborative todo app using CRDTs (via{" "}
        <a href="https://automerge.org">automerge</a>) to communicate between
        peers.
      </p>
      <div>
        <form className="input-container" onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo-input"
            name="task"
            placeholder="Todo..."
          />
          <button type="submit">Add todo</button>
        </form>
      </div>
      <hr className="separator" />
      <div>
        {doc?.todos.map((todo, i) => (
          <div
            className={`todo-container ${todo.done ? "todo-completed" : ""}`}
            key={`${todo.id}-${i}`}
          >
            <p className="todo-description">{todo.task}</p>
            <label htmlFor={`${todo.id}-done`}>Done</label>
            <input
              id={`${todo.id}-done`}
              type="checkbox"
              onClick={() =>
                changeDoc((d) => {
                  const todoIndex = d.todos.findIndex(
                    (el) => el.id === todo.id
                  );
                  const oldTodo = d.todos[todoIndex];
                  d.todos[todoIndex] = { ...oldTodo, done: !oldTodo.done };
                })
              }
            />
            <button
              className="button-delete"
              onClick={() =>
                changeDoc((d) => {
                  const index = d.todos.findIndex((el) => el.id === todo.id);
                  (d.todos as ExtendedArray<Todo>).deleteAt(index);
                })
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="peers-container">
        <div className="peers-heading">
          Connected peers: {Object.keys(peerStates).length}
        </div>
        <button className="peers-button">
          <div className="down">{">"}</div>
        </button>
      </div>

      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        <p>Peers:</p>
        {Object.entries(peerStates).map(([peerId, { clicks }]) => (
          <div key={peerId}>
            {peerId}: {clicks}
          </div>
        ))}
      </div>
      <div className="card">
        <button onClick={() => changeDoc((d) => d.counter.increment(1))}>
          count is {doc && doc.counter.value}
        </button>
        <button onClick={() => changeDoc((d) => d.list.push("a"))}>
          Add to list
        </button>
        <button
          onClick={() => {
            changeDoc((d) => {
              console.log(d.myObject);
              const length = Object.keys(d.myObject).length;
              d.myObject[`z-${length}`] = length.toString();
            });
            setLocalState((state: EphemeralState) => ({
              ...state,
              clicks: state.clicks + 1,
            }));
          }}
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
      </p> */}
    </>
  );
}

export default App;
