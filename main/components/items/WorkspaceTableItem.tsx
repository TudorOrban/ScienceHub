import { GeneralInfo } from "@/types/infoTypes";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import GeneralItemTitle from "./GeneralItemTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { truncateText } from "@/utils/functions";
const SmallWorkCard = dynamic(() => import("../elements/SmallWorkCard"));

type GeneralItemProps = {
    generalInfo: GeneralInfo;
    columns?: string[];
};

const GeneralItem: React.FC<GeneralItemProps> = ({ generalInfo, columns }) => {
    return (
        <tr className="w-full py-0.5 px-2 border-b border-gray-200">
            {columns?.map((column, index) => {
                switch (column) {
                    case "Title":
                        return (
                            <td key={index}>
                                <GeneralItemTitle generalInfo={generalInfo} columns={columns} />
                            </td>
                        );
                    case "Users":
                        return (
                            <td key={index}>
                                {generalInfo.users &&
                                    generalInfo.users
                                        .filter((user, index) => index < 3)
                                        .map((user, index) => (
                                            <div
                                                key={user.id}
                                                className="flex whitespace-nowrap text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                <Link href={`/${user.username}/profile`}>
                                                    {user.fullName}
                                                </Link>
                                                {index < (generalInfo.users || []).length - 1 &&
                                                    ", "}
                                            </div>
                                        ))}
                            </td>
                        );
                    case "Project":
                        if (generalInfo?.project) {
                            return (
                                <td key={index}> 
                                    <div className="flex items-center justify-center h-full">
                                        <div className="flex items-center justify-center max-w-[160px] whitespace-nowrap font-semibold text-sm bg-gray-50 border border-gray-200 rounded-md shadow-sm p-2">
                                            <FontAwesomeIcon
                                                icon={faBoxArchive}
                                                className="small-icon text-gray-700 mr-2"
                                            />
                                            {truncateText(generalInfo.project?.title || "", 14)}
                                        </div>
                                    </div>
                                </td>
                            );
                        } else {
                            return null;
                        }
                    case "Work":
                        if (generalInfo?.work) {
                            return (
                                <td key={index}>
                                    <div className="flex items-center justify-center h-full">
                                        <SmallWorkCard workSmall={generalInfo?.work} />
                                    </div>
                                </td>
                            );
                        } else {
                            return null;
                        }
                    default:
                        return null;
                }
            })}
        </tr>
    );
};

export default GeneralItem;