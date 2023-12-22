import { ProjectDeltaKey, ProjectSubmission } from "@/types/versionControlTypes";
import {
    ProjectLayout,
    ProjectLayoutKey,
    ProjectMetadata,
    ProjectMetadataKey,
} from "@/types/projectTypes";
import { formatDate } from "@/utils/functions";
import { applyTextDiffs } from "@/version-control-system/diff-logic/applyTextDiff";
import Link from "next/link";
import { useMemo, useState } from "react";

interface ProjectSubmissionChangesBoxProps {
    submission: ProjectSubmission;
    project: ProjectLayout;
    label: string;
    fields?: string[];
    isMetadata?: boolean;
}

const ProjectSubmissionChangesBox: React.FC<ProjectSubmissionChangesBoxProps> = ({
    submission,
    project,
    label,
    fields,
    isMetadata,
}) => {
    const finalVersionData = useMemo(() => {
        if (!fields || !submission || !project) return [];

        return fields?.map((field) => {
            const diffValue = submission?.projectDelta?.[field as ProjectDeltaKey];
            const projectFieldValue = isMetadata
                ? project?.projectMetadata?.[field as ProjectMetadataKey] ?? ""
                : project?.[field as ProjectLayoutKey] ?? "";
            const isAccepted = submission.status === "Accepted";
            // If submission accepted, just use project field value, else apply diffs
            // depending on diffValue type
            const fieldFinalValue = isAccepted
                ? projectFieldValue
                : diffValue?.type === "TextDiff" && (diffValue?.textDiffs?.length || 0) > 0
                ? applyTextDiffs(projectFieldValue as string, diffValue.textDiffs || [])
                : diffValue?.type === "TextArray" && diffValue?.textArrays;

            return {
                fieldLabel: field.charAt(0).toUpperCase() + field.slice(1, field.length),
                fieldValue: fieldFinalValue,
                type: diffValue?.type,
                date: formatDate(diffValue?.lastChangeDate || ""),
                user: diffValue?.lastChangeUser,
            };
        });
    }, [submission, project, fields]);

    return (
        <div className="border border-gray-300 rounded-md shadow-sm">
            <table className="w-full">
                <thead
                    className="text-sm font-semibold whitespace-nowrap border-b border-gray-300"
                    style={{
                        backgroundColor: "var(--page-header-bg-color)",
                    }}
                >
                    <tr>
                        <th
                            className="px-4 py-2 text-start"
                            style={{ fontWeight: "500", fontSize: "18px" }}
                        >
                            {label}
                        </th>
                        <th className="px-4 py-2 text-start">Last Modified At</th>
                        <th className="px-4 py-2 text-start">By Author</th>
                    </tr>
                </thead>
                <tbody>
                    {finalVersionData?.map((data) => {
                        if (data?.type === "TextDiff") {
                            return (
                                <tr key={data.fieldLabel} className="break-words">
                                    <td className="px-4 py-2">
                                        <div className="font-semibold">{data.fieldLabel}</div>
                                        <div>{data.fieldValue as string}</div>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">{data.date}</td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/${data?.user?.username}/profile`}
                                            className="whitespace-nowrap text-blue-600 hover:text-blue-800"
                                        >
                                            {data?.user?.fullName}
                                        </Link>
                                    </td>
                                </tr>
                            );
                        } else if (data?.type === "TextArray") {
                            return (
                                <tr key={data.fieldLabel} className="break-words">
                                    <td className="flex items-center flex-wrap px-4 py-2 ">
                                        <div className="font-semibold">
                                            {data.fieldLabel + ": "}
                                        </div>
                                        {(data?.fieldValue as string[]).map((text) => (
                                            <div key={text} className="ml-1">
                                                {text + ","}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">{data?.date}</td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/${data?.user?.username}/profile`}
                                            className="whitespace-nowrap text-blue-600 hover:text-blue-800"
                                        >
                                            {data?.user?.fullName}
                                        </Link>
                                    </td>
                                </tr>
                            );
                        }
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectSubmissionChangesBox;
