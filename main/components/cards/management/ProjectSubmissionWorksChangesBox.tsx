import { ProjectDeltaKey, ProjectSubmission } from "@/types/versionControlTypes";
import { ProjectLayout, ProjectLayoutKey } from "@/types/projectTypes";
import { formatDate } from "@/utils/functions";
import { applyTextDiffs } from "@/version-control-system/diff-logic/applyTextDiff";
import Link from "next/link";
import { useWorksSmallSearch } from "@/hooks/fetch/search-hooks/works/useWorksSmallSearch";

interface ProjectSubmissionWorksChangesBoxProps {
    submission: ProjectSubmission;
    project: ProjectLayout;
    fields?: string[];
    isMetadata?: boolean;
}

/**
 * Component to compute and display the changes to works associated to a project submission
 */
const ProjectSubmissionWorksChangesBox: React.FC<ProjectSubmissionWorksChangesBoxProps> = ({
    submission,
    project,
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
                            {"Work Submissions"}
                        </th>
                        <th className="px-4 py-2 text-start">Last Modified At</th>
                        <th className="px-4 py-2 text-start">By Author</th>
                    </tr>
                </thead>
                <tbody>
                    {submission?.workSubmissions?.map((workSubmission) => (
                        <tr key={workSubmission.id} className="break-words">
                            <td className="px-4 py-2 font-semibold">
                                    {workSubmission.title}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                {"N"}
                                {/* {formatDate(workSubmission.?.lastChangeDate || "")} */}
                            </td>
                            <td className="px-4 py-2">
                                {"N"}
                                {/* <Link
                                    href={`/${value?.lastChangeUser?.username}/profile`}
                                    className="whitespace-nowrap text-blue-600 hover:text-blue-800"
                                >
                                    {value?.lastChangeUser?.fullName}
                                </Link> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectSubmissionWorksChangesBox;
