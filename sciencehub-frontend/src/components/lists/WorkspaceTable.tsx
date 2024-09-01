import { GeneralInfo } from "@/src/types/infoTypes";
import WorkspaceNoResultsFallback from "../fallback/WorkspaceNoResultsFallback";
import { Skeleton } from "../ui/skeleton";
import WorkspaceTableItem from "../items/WorkspaceTableItem";

type WorkspaceTableProps = {
    data: GeneralInfo[];
    columns?: string[];
    itemType?: string;
    isLoading?: boolean;
    isSuccess?: boolean;
};

/**
 * General Table component used throughout the Workspace pages.
 */
const WorkspaceTable: React.FC<WorkspaceTableProps> = ({
    data,
    columns = ["Title"],
    itemType,
    isLoading,
    isSuccess,
}) => {
    const loadingData = [...Array(6).keys()];
    const showFallback = !isLoading && isSuccess && !!data && data.length === 0;

    if (isLoading) {
        return (
            <ul className="w-full p-4 space-y-4 overflow-x-hidden">
                {loadingData.map((item) => (
                    <Skeleton key={item} className="w-full bg-gray-300 h-10" />
                ))}
            </ul>
        );
    }

    return (
        <>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-300 shadow-sm">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`py-3 text-lg text-gray-800 ${column === "Title" ? "pl-8 text-left" : ""}`}
                                style={{
                                    backgroundColor: "var(--page-header-bg-color)",
                                    fontWeight: 500,
                                }}
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {!showFallback ? (
                        data.map((item, index) => (
                            <WorkspaceTableItem
                                key={item.id}
                                generalInfo={item}
                                columns={columns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td>
                                <WorkspaceNoResultsFallback itemType={itemType} />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default WorkspaceTable;
