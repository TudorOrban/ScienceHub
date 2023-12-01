import { GeneralInfo } from "@/types/infoTypes";
import WorkspaceNoResultsFallback from "./WorkspaceNoResultsFallback";
import dynamic from "next/dynamic";
import { getObjectNames } from "@/utils/getObjectNames";
const GeneralItem = dynamic(() => import("@/components/items/GeneralItem"));

type GeneralListProps = {
    data: GeneralInfo[];
    columns?: string[];
    itemType?: string;
    disableNumbers?: boolean;
    isLoading?: boolean;
    shouldPush?: boolean;
};

const GeneralList: React.FC<GeneralListProps> = (props) => {
    const loadingData = [{}, {}, {}, {}, {}, {}, {}, {}];

    const columns = props.columns || ["Title"];

    // Simplify the rendering logic by directly using props.isLoading and checking the data length
    const isLoading = props.isLoading;
    const hasData = props.data && props.data.length > 0;
    const showFallback = !isLoading && !hasData;

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
                                        shouldPush={props.shouldPush}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : hasData ? (
                    <ul>
                        {props.data.map((item, index) => (
                            <li key={index}>
                                <div className="text-lg border-b border-gray-200">
                                    <GeneralItem
                                        generalInfo={item}
                                        columns={columns}
                                        index={
                                            !props.disableNumbers
                                                ? index + 1
                                                : undefined
                                        }
                                        isLoading={false}
                                        shouldPush={props.shouldPush}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : showFallback ? (
                    <WorkspaceNoResultsFallback
                        itemType={
                            getObjectNames({ tableName: props.itemType })?.label
                        }
                    />
                ) : null}
            </div>
        </>
    );
};

export default GeneralList;
