import { type FC, useState } from "react";
import "./App.css";
import { type Todo, useTodos } from "./hooks/todo";
import { manta } from "./lib/manta";

function App() {
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const todos = useTodos();

	const addTodo = async () => {
		try {
			setIsLoading(true);
			if (inputValue.trim() === "") return;

			const lastTodo = todos.data ? todos.data[todos.data.length - 1] : null;
			const newPkid = lastTodo ? Number(lastTodo.pkid) + 1 : 1;

			await fetch(
				"https://api.mantahq.com/api/workflow/obcodelab/mantawelcome/create-task",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						task_description: inputValue,
						pkid: newPkid,
						status: "pending",
					}),
				},
			);
			setInputValue("");
			await todos.refetch();
		} catch (err) {
			alert("Failed to add todo. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			addTodo();
		}
	};

	return (
		<div className="todo-container">
			<h1>Todo List</h1>
			<div className="input-container">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Add a new task..."
					className="todo-input"
				/>
				<button
					disabled={isLoading}
					type="button"
					onClick={addTodo}
					className="add-btn"
				>
					Add
				</button>
			</div>
			<ul className="todo-list">
				{todos.data?.map((todo) => (
					<TodoItem key={todo.pkid} todo={todo} />
				))}
			</ul>
			{todos.data?.length === 0 && (
				<p className="empty-message">No tasks yet. Add one above!</p>
			)}
		</div>
	);
}

const TodoItem: FC<{ todo: Todo }> = ({ todo }) => {
	const todos = useTodos();
	const [isLoading, setIsLoading] = useState(false);

	const deleteTodo = async () => {
		try {
			setIsLoading(true);
			await fetch(
				`https://api.mantahq.com/api/workflow/obcodelab/mantawelcome/delete-task/${todo.pkid}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ pkid: todo.pkid }),
				},
			);
			await todos.refetch();
		} catch (err) {
			alert("Failed to delete todo. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<li
			className={`todo-item ${todo.status === "completed" ? "completed" : ""}`}
		>
			<span className="todo-text">{todo.task_description}</span>
			<button
				type="button"
				onClick={deleteTodo}
				className="delete-btn"
				disabled={isLoading}
			>
				Delete
			</button>
		</li>
	);
};

export default App;
