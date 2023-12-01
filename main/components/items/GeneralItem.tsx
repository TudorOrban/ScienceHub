import { GeneralInfo } from "@/types/infoTypes";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
const GeneralItemTitle = dynamic(() => import("./GeneralItemTitle"));
const SmallProjectCard = dynamic(() => import("../elements/SmallProjectCard"));
const SmallWorkCard = dynamic(() => import("../elements/SmallWorkCard"));

type GeneralItemProps = {
    generalInfo: GeneralInfo;
    columns?: string[];
    index?: number;
    isLoading?: boolean;
    shouldPush?: boolean;
};

const GeneralItem: React.FC<GeneralItemProps> = ({
    generalInfo,
    columns,
    index,
    isLoading,
    shouldPush,
}) => {
    return (
        <div className="w-full flex items-center h-18">
            <div className="w-[1240px]">
                {columns?.includes("Title") && (
                    <GeneralItemTitle
                        generalInfo={generalInfo}
                        columns={columns}
                        index={index}
                        isLoading={isLoading}
                        shouldPush={shouldPush}
                    />
                )}
            </div>

            <div className={`w-full flex justify-between pr-10`}>
                <div className="flex items-center overflow-hidden w-20 sm:w-30 md:w-48 lg:w-40">
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis text-blue-700 text-base">
                        <span className="pr-1">
                            {columns?.includes("Users") &&
                                generalInfo.users &&
                                generalInfo.users.map((user, index) => (
                                    <React.Fragment key={user.id}>
                                        <Link
                                            href={`/${user.username}/profile`}
                                        >
                                            {user.fullName}
                                        </Link>
                                        {index <
                                            (generalInfo.users || []).length -
                                                1 && ", "}
                                    </React.Fragment>
                                ))}
                        </span>
                    </div>
                </div>

                <div className="hidden lg:block">
                    {columns?.includes("Project") && generalInfo.project && (
                        <SmallProjectCard projectSmall={generalInfo.project} />
                    )}
                    {columns?.includes("Work") && generalInfo.work && (
                        <SmallWorkCard workSmall={generalInfo.work} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeneralItem;
