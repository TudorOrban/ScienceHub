import { GeneralInfo } from "@/types/infoTypes";
import WorkspaceNoResultsFallback from "../fallback/WorkspaceNoResultsFallback";
import GeneralItem from "../items/GeneralItem";
import { Skeleton } from "../ui/skeleton";

type GeneralListProps = {
    data: GeneralInfo[];
    columns?: string[];
    itemType?: string;
    disableNumbers?: boolean;
    isLoading?: boolean;
    isSuccess?: boolean;
};

// TODO: Transform into proper table
const GeneralList: React.FC<GeneralListProps> = ({
    data,
    columns = ["Title"],
    itemType,
    disableNumbers,
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
            <div className={`general-list-header`}>
                <div
                    className="w-[24rem] text-gray-800"
                    style={{ fontWeight: "500", fontSize: "16px" }}
                >
                    {columns[0]}
                </div>
                <div className="w-full flex items-center justify-between">
                    {columns.map((column, index) => (
                        <div
                            key={index}
                            className={`h-14 flex items-center text-gray-800 mx-8 ${
                                column === "Project" || column === "Work" ? "hidden lg:flex" : ""
                            } ${column === "Users" ? "hidden md:flex" : ""}`}
                            style={{ fontWeight: "500", fontSize: "16px" }}
                        >
                            {index !== 0 ? column : null}
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full pl-4">
                {!showFallback ? (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index} className="text-lg border-b border-gray-200">
                                <GeneralItem
                                    generalInfo={item}
                                    columns={columns}
                                    index={!disableNumbers ? index + 1 : undefined}
                                    isLoading={false}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <WorkspaceNoResultsFallback itemType={itemType} />
                )}
            </div>
        </>
    );
};

export default GeneralList;
