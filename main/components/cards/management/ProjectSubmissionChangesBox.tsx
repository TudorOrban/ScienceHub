import { ProjectDeltaKey, ProjectSubmission } from "@/types/versionControlTypes";
import { ProjectLayout, ProjectLayoutKey } from "@/types/projectTypes";
import { formatDate } from "@/utils/functions";
import { applyTextDiffs } from "@/version-control-system/diff-logic/applyTextDiff";
import Link from "next/link";

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
                    {fields?.map((field) => {
                        const value = submission?.projectDelta?.[field as ProjectDeltaKey];

                        if (value?.type === "TextDiff" && (value?.textDiffs?.length || 0) > 0) {
                            return (
                                <tr key={field} className="break-words">
                                    <td className="px-4 py-2">
                                        <div className="font-semibold">
                                            {field.charAt(0).toUpperCase() +
                                                field.slice(1, field.length)}
                                        </div>
                                        <div>
                                            {applyTextDiffs(
                                                isMetadata
                                                    ? (project?.[field as ProjectLayoutKey] as string) ?? ""
                                                    : (project?.[field as ProjectLayoutKey] as string) ?? "",
                                                value.textDiffs || []
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {formatDate(value?.lastChangeDate || "")}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/${value?.lastChangeUser?.username}/profile`}
                                            className="whitespace-nowrap text-blue-600 hover:text-blue-800"
                                        >
                                            {value?.lastChangeUser?.fullName}
                                        </Link>
                                    </td>
                                </tr>
                            );
                        } else if (
                            value?.type === "TextArray" &&
                            (value?.textArrays?.length || 0) > 0
                        ) {
                            return (
                                <tr key={field} className="break-words">
                                    <td className="flex items-center flex-wrap px-4 py-2 ">
                                        <div className="font-semibold">
                                            {field.charAt(0).toUpperCase() +
                                                field.slice(1, field.length) +
                                                ": "}
                                        </div>
                                        {value?.textArrays?.map((text) => (
                                            <div key={text}>
                                                {text}
                                                {", "}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {formatDate(value?.lastChangeDate || "")}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/${value?.lastChangeUser?.username}/profile`}
                                            className="whitespace-nowrap text-blue-600 hover:text-blue-800"
                                        >
                                            {value?.lastChangeUser?.fullName}
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
