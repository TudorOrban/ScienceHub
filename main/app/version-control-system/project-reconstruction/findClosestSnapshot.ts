import {
    ProjectGraph,
} from "@/types/versionControlTypes"

type FindClosestSnapshotOutput = {
    closestSnapshotVersionId: string | null;
    path: Record<string, string>;
};

export const findClosestSnapshot = (
    projectGraph: ProjectGraph | null,
    versionId: string
): FindClosestSnapshotOutput => {
    if (!projectGraph) {
        return { closestSnapshotVersionId: null, path: {} };
    }

    const { graphData } = projectGraph;

    let visited: Record<string, boolean> = {};
    let queue: string[] = [versionId];
    let parent: Record<string, string> = {};
    let path: Record<string, string> = {};

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current || visited[current]) continue;

        visited[current] = true;

        if (graphData[current]?.isSnapshot) {
            // Found the closest snapshot, construct the path
            let temp = current;
            while (parent[temp]) {
                path[temp] = parent[temp];
                temp = parent[temp];
            }
            return { closestSnapshotVersionId: current, path };
        }

        const neighbors = graphData[current]?.neighbors || [];
        for (const neighbor of neighbors) {
            if (!visited[neighbor]) {
                queue.push(neighbor);
                if (!parent[neighbor]) {
                    parent[neighbor] = current;
                }
            }
        }
    }

    return { closestSnapshotVersionId: null, path: {} };
};

/*



*/



