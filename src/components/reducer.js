export const initial_state = {
  task: "",
  todos: JSON.parse(localStorage.getItem("todos")) || [],
  filter: "all", // all | completed | pending
  theme: localStorage.getItem("theme") || "dark",
  lastDeleted: null, // for undo delete
};

export const reducer = (state, action) => {
  let updatedTodos;

  switch (action.type) {
    case "SET_TASK":
      return { ...state, task: action.payload };

    case "ADD_TASK":
      if (!state.task.trim()) return state;

      updatedTodos = [
        ...state.todos,
        {
          id: Date.now(),
          text: state.task,
          completed: false,
          isEditing: false,
        },
      ];

      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return { ...state, todos: updatedTodos, task: "" };

    case "DELETE_TASK":
      updatedTodos = state.todos.filter(
        (todo) => todo.id !== action.payload.id
      );

      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      return {
        ...state,
        todos: updatedTodos,
        lastDeleted: action.payload,
      };

    case "UNDO_DELETE":
      if (!state.lastDeleted) return state; // ✅ SAFETY

      updatedTodos = [...state.todos, state.lastDeleted];
      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      return { ...state, todos: updatedTodos, lastDeleted: null };

    case "MARK_COMPLETE":
      updatedTodos = state.todos.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );

      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return { ...state, todos: updatedTodos };

    case "EDIT_TASK":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, isEditing: true }
            : todo
        ),
      };

    case "UPDATE_TASK":
      updatedTodos = state.todos.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text, isEditing: false }
          : todo
      );

      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return { ...state, todos: updatedTodos };

    case "CLEAR_COMPLETED":
      updatedTodos = state.todos.filter((todo) => !todo.completed);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      return { ...state, todos: updatedTodos, lastDeleted: null };

    case "SET_FILTER":
      return { ...state, filter: action.payload };

    case "TOGGLE_THEME":
      localStorage.setItem("theme", action.payload);
      return { ...state, theme: action.payload };

    default:
      return state;
  }
};