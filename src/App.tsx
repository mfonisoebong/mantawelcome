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

			await manta.createRecords({
				table: "todos",
				data: [
					{
						task: inputValue,
						status: "pending",
						id: crypto.randomUUID(),
					},
				],
			});
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
					<TodoItem key={todo.id} todo={todo} />
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

	const toggleTodo = async () => {
		try {
			setIsLoading(true);
			const newStatus = todo.status === "completed" ? "pending" : "completed";
			await manta.updateRecords({
				table: "todos",
				data: {
					status: newStatus,
				},
				where: {
					id: todo.id,
				},
			});
			await todos.refetch();
		} catch (err) {
			alert("Failed to update todo. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const deleteTodo = async () => {
		try {
			setIsLoading(true);
			await manta.deleteRecords({
				table: "todos",
				where: [
					{
						id: todo.id,
					},
				],
			});
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
			<input
				type="checkbox"
				disabled={isLoading}
				checked={todo.status === "completed"}
				onChange={() => toggleTodo()}
				className="todo-checkbox"
			/>
			<span className="todo-text">{todo.task}</span>
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
