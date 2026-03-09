import { useQuery } from "@tanstack/react-query";
import { manta } from "../lib/manta";

export type Todo = {
	id: string;
	task: string;
	status: "completed" | "pending";
};

export function useTodos() {
	const fetcher = async () =>
		await manta
			.fetchAllRecords({
				table: "todos",
				fields: ["id", "task", "status"],
			})
			.then((res) => res.data as Todo[]);

	return useQuery({
		queryKey: ["todos"],
		queryFn: fetcher,
	});
}
