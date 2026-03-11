import { useQuery } from "@tanstack/react-query";

export type Todo = {
	pkid: string;
	task_description: string;
	status: "completed" | "pending";
};

export function useTodos() {
	const fetcher = async (): Promise<Todo[]> => {
		const response: { data: Todo[] } = await fetch(
			"https://api.mantahq.com/api/workflow/obcodelab/mantawelcome/get-tasks",
		).then((res) => res.json());
		return response.data;
	};

	return useQuery({
		queryKey: ["todos"],
		queryFn: fetcher,
	});
}
