import { GeneralInfo } from "@/types/infoTypes";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import GeneralItemTitle from "./GeneralItemTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { truncateText } from "@/utils/functions";
const SmallProjectCard = dynamic(() => import("../elements/SmallProjectCard"));
const SmallWorkCard = dynamic(() => import("../elements/SmallWorkCard"));

type GeneralItemProps = {
    generalInfo: GeneralInfo;
    columns?: string[];
    index?: number;
    isLoading?: boolean;
};

const GeneralItem: React.FC<GeneralItemProps> = ({ generalInfo, columns, index, isLoading }) => {
    return (
        <div className="w-full flex items-center h-18">
            <div className="w-[1240px]">
                {columns?.includes("Title") && (
                    <GeneralItemTitle
                        generalInfo={generalInfo}
                        columns={columns}
                        index={index}
                        isLoading={isLoading}
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
                                        <Link href={`/${user.username}/profile`}>
                                            {user.fullName}
                                        </Link>
                                        {index < (generalInfo.users || []).length - 1 && ", "}
                                    </React.Fragment>
                                ))}
                        </span>
                    </div>
                </div>

                <div className="hidden lg:block">
                    {columns?.includes("Project") && generalInfo.project && (
                        <div className="flex items-center whitespace-nowrap font-semibold">
                            <FontAwesomeIcon
                                icon={faBoxArchive}
                                className="small-icon text-gray-700 mr-2"
                            />
                            {truncateText(generalInfo.project.title || "", 14)}
                        </div>
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
