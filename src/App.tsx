import "./App.css";

import {
  useBootstrap,
  useDocument,
  useLocalAwareness,
  useRemoteAwareness,
} from "@automerge/automerge-repo-react-hooks";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { Peers } from "./components/Peers/Peers";
import { Todo } from "./components/Todo/Todo";

export interface EphemeralState {
  username: string;
  todosCreated: number;
  todosCompleted: number;
  todosUncompleted: number;
  todosDeleted: number;
}

export interface TodoItem {
  id: string;
  task: string;
  done: boolean;
}

interface CounterDoc {
  todos: TodoItem[];
}

interface AppProps {
  userId: string;
}

interface ExtendedArray<T> extends Array<T> {
  insertAt(index: number, ...args: T[]): ExtendedArray<T>;
  deleteAt(index: number, numDelete?: number): ExtendedArray<T>;
}

const username = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
  length: 3,
  separator: "",
  style: "capital",
});

/**
 * TODO
 * MUST
 * Clean up
 * */

function App({ userId }: AppProps) {
  // Setup document here
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

  const [, setLocalState] = useLocalAwareness({
    handle,
    userId,
    initialState: {
      username,
      todosCreated: 0,
      todosCompleted: 0,
      todosUncompleted: 0,
      todosDeleted: 0,
    },
  });

  const [peerStates, heartbeats] = useRemoteAwareness({
    handle,
    localUserId: userId,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const task = formData.get("task");

    if (task || task !== "") {
      const todo: TodoItem = {
        id: crypto.randomUUID(),
        task: task as string,
        done: false,
      };

      changeDoc((d) => d.todos.push(todo));
      setLocalState(
        (state: EphemeralState): EphemeralState => ({
          ...state,
          todosCreated: state.todosCreated + 1,
        })
      );
      event.currentTarget.reset();
    }
  };

  const handleTodoDone = (todo: TodoItem) => {
    changeDoc((d) => {
      const todoIndex = d.todos.findIndex((el) => el.id === todo.id);

      d.todos[todoIndex].done = !d.todos[todoIndex].done;
    });

    if (!todo.done) {
      setLocalState(
        (state: EphemeralState): EphemeralState => ({
          ...state,
          todosCompleted: state.todosCompleted + 1,
        })
      );
    } else {
      setLocalState(
        (state: EphemeralState): EphemeralState => ({
          ...state,
          todosUncompleted: state.todosUncompleted + 1,
        })
      );
    }
  };

  const handleTodoDeleted = (todo: TodoItem) => {
    changeDoc((d) => {
      const index = d.todos.findIndex((el) => el.id === todo.id);
      (d.todos as ExtendedArray<TodoItem>).deleteAt(index);
    });
    setLocalState(
      (state: EphemeralState): EphemeralState => ({
        ...state,
        todosDeleted: state.todosDeleted + 1,
      })
    );
  };

  return (
    <>
      <h1>ToDo (better title required)</h1>
      <p>
        A collaborative todo app using CRDTs (via{" "}
        <a href="https://automerge.org" target="_blank">
          automerge
        </a>
        ) to communicate between peers.
      </p>
      <p>
        Your username is{" "}
        <input
          type="text"
          defaultValue={username}
          onBlur={(event) =>
            setLocalState(
              (state: EphemeralState): EphemeralState => ({
                ...state,
                username: event.target.value,
              })
            )
          }
        />
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
        {doc?.todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            onCompleteTodo={handleTodoDone}
            onDeleteTodo={handleTodoDeleted}
          />
        ))}
      </div>
      <Peers peerStates={peerStates} heartbeats={heartbeats} />

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
