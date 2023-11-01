import "./Todo.css";
import { TodoItem } from "../../App";

interface TodoProps {
  todo: TodoItem;
  onCompleteTodo: (todo: TodoItem) => void;
  onDeleteTodo: (todo: TodoItem) => void;
}

export const Todo = ({ todo, onCompleteTodo, onDeleteTodo }: TodoProps) => {
  return (
    <div className={`todo-container ${todo.done ? "todo-completed" : ""}`}>
      <p className="todo-description">{todo.task}</p>
      <div className="todo-controls-container">
        <label htmlFor={`${todo.id}-done`}>Done</label>
        <input
          id={`${todo.id}-done`}
          type="checkbox"
          checked={todo.done}
          onChange={() => onCompleteTodo(todo)}
        />
        <button className="button-delete" onClick={() => onDeleteTodo(todo)}>
          Delete
        </button>
      </div>
    </div>
  );
};
