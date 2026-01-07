import React, { useReducer, useState } from "react";
import { initial_state, reducer } from "./reducer";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaSave,
  FaTimes,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TodoApp = () => {
  const [state, dispatch] = useReducer(reducer, initial_state);
  const [editText, setEditText] = useState("");

  const filteredTodos = state.todos
    .filter(Boolean)
    .filter((todo) => {
      if (state.filter === "completed") return todo.completed;
      if (state.filter === "pending") return !todo.completed;
      return true;
    });

  const isDark = state.theme === "dark";

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500
      ${isDark
          ? "bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
        }`}
    >
      {/* CARD */}
      <div
        className={`w-full max-w-md rounded-3xl p-6 shadow-2xl backdrop-blur-md
        ${isDark
            ? "bg-white/5 border border-white/10"
            : "bg-white border border-gray-200"
          }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-wide">
            Todo List
          </h2>

          <button
            onClick={() => {
              dispatch({
                type: "TOGGLE_THEME",
                payload: isDark ? "light" : "dark",
              });
              toast.info("Theme switched 🎨");
            }}
            className="p-2 rounded-full hover:scale-110 transition"
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* INPUT */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={state.task}
            placeholder="What’s your next task?"
            onChange={(e) =>
              dispatch({ type: "SET_TASK", payload: e.target.value })
            }
            className={`flex-1 px-4 py-2 rounded-xl outline-none transition
              ${isDark
                ? "bg-black/60 text-white focus:ring-2 focus:ring-indigo-500"
                : "bg-gray-100 focus:ring-2 focus:ring-indigo-400"
              }`}
          />

          <button
            onClick={() => {
              if (!state.task.trim()) {
                toast.error("Task cannot be empty");
                return;
              }
              dispatch({ type: "ADD_TASK" });
              toast.success("Task added");
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500
              hover:scale-105 transition text-white font-medium"
          >
            Add
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex justify-between mb-4">
          {
            [
              { label: "All", value: "all" },
              { label: "Completed", value: "completed" },
              { label: "Pending", value: "pending" },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() =>
                  dispatch({ type: "SET_FILTER", payload: type.value })
                }
                className={`px-3 py-1 rounded-full text-sm transition
                  ${state.filter === type.value
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-400/20 hover:bg-gray-400/30"
                  }`}
              >
                {type.label}
              </button>

            ))}
        </div>

        {/* CLEAR COMPLETED */}
        <button
          disabled={!state.todos.some((t) => t && t.completed)}
          onClick={() => {
            dispatch({ type: "CLEAR_COMPLETED" });
            toast.info("Completed tasks cleared");
          }}
          className="w-full mb-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-500
            transition disabled:opacity-40 text-white"
        >
          Clear Completed
        </button>

        {/* LIST */}
        <ul className="space-y-3">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl
                transition-all duration-900 hover:scale-[1.02]
                ${todo.completed
                  ? "bg-green-500/90 text-white"
                  : isDark
                    ? "bg-black/60"
                    : "bg-white"
                }`}
            >
              {todo.isEditing ? (
                <>
                  <input
                    defaultValue={todo.text}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-3 py-1 rounded-lg bg-black/40 outline-none"
                  />
                  <button
                    onClick={() => {
                      dispatch({
                        type: "UPDATE_TASK",
                        payload: {
                          id: todo.id,
                          text: editText || todo.text,
                        },
                      });
                      toast.success("Task updated");
                    }}
                    className="ml-2 text-green-300 hover:scale-110 transition"
                  >
                    <FaSave />
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`flex-1 ${todo.completed ? "line-through opacity-80" : ""
                      }`}
                  >
                    {todo.text}
                  </span>

                  <div className="flex gap-3">
                    {/* TOGGLE */}
                    <button
                      onClick={() =>
                        dispatch({
                          type: "MARK_COMPLETE",
                          payload: todo.id,
                        })
                      }
                      className={`transition-transform duration-300
                        ${todo.completed
                          ? "rotate-180 text-red-300"
                          : "text-green-300"
                        }`}
                    >
                      {todo.completed ? <FaTimes /> : <FaCheck />}
                    </button>

                    {/* EDIT */}
                    <button
                      disabled={todo.completed}
                      onClick={() => {
                        setEditText(todo.text);
                        dispatch({
                          type: "EDIT_TASK",
                          payload: todo.id,
                        });
                      }}
                      className={`transition ${todo.completed
                        ? "opacity-40 cursor-not-allowed"
                        : "text-yellow-300 hover:scale-110"
                        }`}
                    >
                      <FaEdit />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        dispatch({
                          type: "DELETE_TASK",
                          payload: todo,
                        });
                        toast.error(
                          <span>
                            Task deleted{" "}
                            <button
                              className="underline ml-1"
                              onClick={() =>
                                dispatch({ type: "UNDO_DELETE" })
                              }
                            >
                              UNDO
                            </button>
                          </span>
                        );
                      }}
                      className="text-red-300 hover:scale-110 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer position="top-right" autoClose={2200} theme="dark" />
    </div>
  );
};

export default TodoApp;