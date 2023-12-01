import { useEffect, useState } from "react";
import { useGeneralQuery } from "./useGeneralQuery";
import { ProjectSmall } from "@/types/projectTypes";

const useProjectsSmallOld = (projectIds: string[], enabled: boolean) => {
    const { data, error, isLoading } = useGeneralQuery<ProjectSmall[]>({
        tableName: "projects",
        tableRowsIds: projectIds,
        categories: [],
        tableNameFields: ["id", "title", "name"],
        enabled: enabled,
    });

    const [projectsData, setProjectsData] = useState<ProjectSmall[] | null>(
        null
    );

    useEffect(() => {
        if (data) {
            const projectsFormattedSmall = data.map((project) => {
                const { id, title, name, ...rest } = project as any;

                return {
                    id: id,
                    title: title,
                    name: name,
                };
            });
            setProjectsData(projectsFormattedSmall);
        }
    }, [data]);

    return { projectsData, error, isLoading };
};

export default useProjectsSmallOld;
