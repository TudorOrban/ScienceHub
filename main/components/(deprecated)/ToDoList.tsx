import { trpc } from "@/app/_trpc/client";

export default function ToDoList() {
    const getTodos = trpc.getTodos.useQuery();

    return (
        <div>
            <div>{JSON.stringify(getTodos.data)}</div>
        </div>
    );
}
