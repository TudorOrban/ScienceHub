import { GeneralInfo } from "@/types/infoTypes";
import WorkspaceNoResultsFallback from "./WorkspaceNoResultsFallback";
import dynamic from "next/dynamic";
import { getObjectNames } from "@/config/getObjectNames";
const GeneralItem = dynamic(() => import("@/components/items/GeneralItem"));

type GeneralListProps = {
    data: GeneralInfo[];
    columns?: string[];
    itemType?: string;
    disableNumbers?: boolean;
    isLoading?: boolean;
    shouldPush?: boolean;
};

const GeneralList: React.FC<GeneralListProps> = ({
    data,
    columns = ["Title"],
    itemType,
    disableNumbers,
    isLoading,
    shouldPush,
}) => {
    const loadingData = [{}, {}, {}, {}, {}, {}, {}, {}];

    const showFallback = !isLoading && data !== null && data !== undefined && data.length === 0;

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
                                column === "Project" || column === "Work"
                                    ? "hidden lg:flex"
                                    : ""
                            } ${column === "Users" ? "hidden md:flex" : ""}`}
                            style={{ fontWeight: "500", fontSize: "16px" }}
                        >
                            {index !== 0 ? column : null}
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full pl-4">
                {isLoading ? (
                    <ul>
                        {loadingData.map((_, index) => (
                            <li key={index}>
                                <div className="text-lg border-b border-gray-200">
                                    <GeneralItem
                                        generalInfo={{} as GeneralInfo}
                                        columns={columns}
                                        isLoading={true}
                                        shouldPush={shouldPush}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : data?.length > 0 ? (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>
                                <div className="text-lg border-b border-gray-200">
                                    <GeneralItem
                                        generalInfo={item}
                                        columns={columns}
                                        index={
                                            !disableNumbers
                                                ? index + 1
                                                : undefined
                                        }
                                        isLoading={false}
                                        shouldPush={shouldPush}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : showFallback ? (
                    <WorkspaceNoResultsFallback
                        itemType={
                            getObjectNames({ tableName: itemType })?.label
                        }
                    />
                ) : null}
            </div>
        </>
    );
};

export default GeneralList;
