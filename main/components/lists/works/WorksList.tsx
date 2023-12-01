import { WorkInfo } from "@/types/infoTypes";
import WorkItem from "../../items/works/WorkItem";
import WorkspaceNoResultsFallback from "../WorkspaceNoResultsFallback";

type WorksListProps = {
    data: WorkInfo[];
    workType?: string;
    disableNumbers?: boolean;
    isLoading?: boolean;
    shouldPush?: boolean;
};

const WorksList: React.FC<WorksListProps> = (props) => {
    const loadingData = [{}, {}, {}, {}, {}, {}, {}, {}];
    
    return (
        <div className="w-full">
            <div className="w-full h-14 flex items-center pl-8 text-lg font-semibold text-gray-900 bg-gray-50 border-b border-gray-200 shadow-sm  rounded-t-lg">
                Title
            </div>
            {!props.isLoading ? (
                <ul>
                    {props.data?.length > 0 ? (
                        props.data.map((item, index) => {
                            if (props.disableNumbers) {
                                return (
                                    <li key={index}>
                                        <div className="text-lg pl-4 py-1 border-b border-gray-200">
                                            <WorkItem
                                                workInfo={item}
                                                isLoading={false}
                                                shouldPush={props.shouldPush}
                                            />
                                        </div>
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={index}>
                                        <div className="flex items-center border-b border-gray-200 text-lg pl-4">
                                            <WorkItem
                                                workInfo={item}
                                                index={index + 1}
                                                isLoading={false} 
                                                shouldPush={props.shouldPush}
                                            />
                                        </div>
                                    </li>
                                );
                            }
                        })
                    ) : (
                        <WorkspaceNoResultsFallback itemType={props.workType} />
                    )}
                </ul>
            ) : (
                <ul>
                    {loadingData.map((item, index) => {
                        return (
                            <li key={index}>
                                <div className="flex items-center border-b border-gray-200 text-lg pl-4">
                                    <WorkItem
                                        workInfo={item}
                                        isLoading={true}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default WorksList;
