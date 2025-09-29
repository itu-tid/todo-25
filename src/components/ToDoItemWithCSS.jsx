export default function ToDoItemWithCSS({ highlight, children }) {
  return (
    <li
      className={
        highlight ? "highlighted-todo-item" : "non-highlighted-todo-item"
      }
    >
      {children}
    </li>
  );
}
