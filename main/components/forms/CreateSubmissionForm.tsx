import { useCreateGeneralData } from "@/hooks/create/useCreateGeneralData";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useProjectGraph from "@/version-control-system/hooks/useProjectGraph";
import React from "react";
import { useProjectSelectionContext } from "@/contexts/selections/ProjectSelectionContext";
import { useWorkSelectionContext } from "@/contexts/selections/WorkSelectionContext";
import { useUsersSelectionContext } from "@/contexts/selections/UsersSelectionContext";
import { workTypes } from "@/config/navItems.config";
import { Switch } from "../ui/switch";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useProjectVersionsSearch } from "@/hooks/fetch/search-hooks/management/useProjectVersionsSearch";
import { useWorkVersionsSearch } from "@/hooks/fetch/search-hooks/management/useWorkVersionsSearch";
import {
    CreateSubmissionFormData,
    CreateSubmissionSchema,
    handleCreateSubmission,
} from "@/submit-handlers/create/handleCreateSubmission";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import ProjectSubmissionSelection from "./form-elements/ProjectSubmissionSelection";
import { useProjectSubmissionSelectionContext } from "@/contexts/selections/ProjectSubmissionSelectionContext";
import UsersSelection from "./form-elements/UsersSelection";
import LoadingSpinner from "../elements/LoadingSpinner";
const ProjectSelection = dynamic(() => import("./form-elements/ProjectSelection"));
const WorkSelection = dynamic(() => import("./form-elements/WorkSelection"));
const ProjectVersionGraph = dynamic(
    () => import("@/components/visualizations/ProjectVersionGraph")
);

interface CreateSubmissionFormProps {
    initialSubmissionObjectType?: string;
    initialProjectId?: number;
    currentProjectVersionId?: number;
    currentWorkVersionId?: number;
    createNewOn?: boolean;
    onCreateNew: () => void;
    context?: string;
}

/**
 * Form for creating a project/work submission. To be refactored.
 */
const CreateSubmissionForm: React.FC<CreateSubmissionFormProps> = ({
    initialSubmissionObjectType,
    initialProjectId,
    currentProjectVersionId,
    currentWorkVersionId,
    createNewOn,
    onCreateNew,
    context,
}) => {
    // States
    const [selectedSubmissionObjectType, setSelectedSubmissionObjectType] = useState<string>(
        initialSubmissionObjectType || ""
    );
    const [selectedProjectVersionId, setSelectedProjectVersionId] = useState<number>(
        currentProjectVersionId || 0
    );
    const [selectedWorkVersionId, setSelectedWorkVersionId] = useState<number>(
        currentWorkVersionId || 0
    );
    const [isGraphExpanded, setIsGraphExpanded] = useState<boolean>(false);

    const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

    // Contexts
    const currentUserId = useUserId();
    const { setOperations } = useToastsContext();
    // - Selected Project, Work, Project Submission and Users contexts
    const { selectedProjectId, setSelectedProjectId } = useProjectSelectionContext();
    const {
        selectedWorkType,
        setSelectedWorkType,
        selectedWorkId,
        setSelectedWorkId,
        projectId,
        setProjectId,
    } = useWorkSelectionContext();
    const { selectedProjectSubmissionId, setSelectedProjectSubmissionId } =
        useProjectSubmissionSelectionContext();
    const { selectedUsersIds, setSelectedUsersIds } = useUsersSelectionContext();

    // Hooks
    const projectVersionsData = useProjectVersionsSearch({
        extraFilters: { project_id: selectedProjectId },
        enabled: !!selectedProjectId,
        context: context || "Project General",
    });

    const worksVersionsData = useWorkVersionsSearch({
        extraFilters: { work_id: selectedWorkId, work_type: selectedWorkType },
        enabled: !!currentUserId,
        context: context || "Project General",
    });

    const projectGraphData = useProjectGraph(Number(selectedProjectId || 0), !!selectedProjectId);
    const projectGraph = projectGraphData.data[0];

    // TODO: fetch only project users + following/ers unless user searches for somebody else

    // Handle selections
    const submissionObjectTypes = ["Project", "Work"];

    const handleSelectSubmissionObjectTypeChange = (value: any) => {
        form.setValue("submissionObjectType", value);
        form.trigger("submissionObjectType");
        setSelectedSubmissionObjectType(value);
        setSelectedProjectId(0);
        setSelectedWorkId(0);
    };

    const handleSelectWorkTypeChange = (value: any) => {
        form.setValue("workType", value);
        form.trigger("workType");
        setSelectedWorkType(value);
    };

    const handleSelectInitialProjectVersionChange = (value: string) => {
        form.setValue("initialProjectVersionId", Number(value));
        form.trigger("initialProjectVersionId");
        setSelectedProjectVersionId(Number(value));
    };

    const handleSelectInitialWorkVersionChange = (value: string) => {
        form.setValue("initialWorkVersionId", Number(value));
        form.trigger("initialWorkVersionId");
        setSelectedWorkVersionId(Number(value));
    };

    const handleSelectProjectGraphNode = (versionId: string) => {
        setSelectedProjectVersionId(Number(versionId));
    };

    const handleGraphExpand = () => {
        setIsGraphExpanded(!isGraphExpanded);
    };

    // Handle selections effects
    useEffect(() => {
        form.setValue("projectId", selectedProjectId);
        form.trigger("projectId");
    }, [selectedProjectId]);

    useEffect(() => {
        form.setValue("workType", selectedWorkType);
        form.trigger("workType");
    }, [selectedWorkType]);

    useEffect(() => {
        form.setValue("workId", selectedWorkId);
        form.trigger("workId");
    }, [selectedWorkId]);

    useEffect(() => {
        form.setValue("projectSubmissionId", selectedProjectSubmissionId);
        form.trigger("projectSubmissionId");
    }, [selectedProjectSubmissionId]);

    useEffect(() => {
        form.setValue("initialProjectVersionId", selectedProjectVersionId);
        form.trigger("initialProjectVersionId");
    }, [selectedProjectVersionId]);

    useEffect(() => {
        form.setValue("initialWorkVersionId", selectedWorkVersionId);
        form.trigger("initialWorkVersionId");
    }, [selectedWorkVersionId]);

    useEffect(() => {
        form.setValue("users", selectedUsersIds);
        form.trigger("users");
    }, [selectedUsersIds]);

    // Form
    const form = useForm<z.infer<typeof CreateSubmissionSchema>>({
        resolver: zodResolver(CreateSubmissionSchema),
        defaultValues: {
            submissionObjectType: initialSubmissionObjectType || "",
            workType: "",
            workId: 0,
            projectId: initialProjectId || 0,
            projectSubmissionId: 0,
            title: "",
            description: "",
            initialProjectVersionId: 0,
            initialWorkVersionId: 0,
            users: [],
            public: false,
        },
    });

    // Submit
    const onSubmit = async (formData: CreateSubmissionFormData) => {
        try {
            await handleCreateSubmission({
                onCreateNew,
                setIsCreateLoading,
                setOperations,
                formData,
            });
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };

    return (
        <Card className="relative w-[800px] h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-300 sticky bg-white top-0 z-50">
                <CardTitle className="py-6 pl-12">Create Submission Form</CardTitle>
                <div className="pr-10">
                    <button className="dialog-close-button" onClick={onCreateNew}>
                        <FontAwesomeIcon icon={faXmark} className="small-icon" />
                    </button>
                </div>
            </div>
            <CardContent className="px-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex items-start w-full py-4 space-x-4">
                            <FormField
                                control={form.control}
                                name="submissionObjectType"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-[350px]">
                                        <FormLabel htmlFor="submissionObjectType">
                                            Submission for *
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={
                                                    handleSelectSubmissionObjectTypeChange
                                                }
                                                value={selectedSubmissionObjectType}
                                                required
                                            >
                                                <SelectTrigger
                                                    id="submissionObjectType"
                                                    className={`${
                                                        fieldState.error
                                                            ? "ring-1 ring-red-600"
                                                            : ""
                                                    }`}
                                                >
                                                    <SelectValue
                                                        placeholder="Select Object Type"
                                                        {...field}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent
                                                    position="popper"
                                                    className="max-h-[200px] overflow-y-auto"
                                                >
                                                    {submissionObjectTypes.map(
                                                        (submissionObjectType, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={submissionObjectType}
                                                            >
                                                                {submissionObjectType}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className={`text-red-600`} />
                                    </FormItem>
                                )}
                            />
                            {selectedSubmissionObjectType === "Work" && (
                                <FormField
                                    control={form.control}
                                    name="workType"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="w-[350px] ">
                                            <FormLabel htmlFor="workType">Work Type *</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={handleSelectWorkTypeChange}
                                                    value={selectedWorkType}
                                                    required
                                                >
                                                    <SelectTrigger
                                                        id="workType"
                                                        className={`${
                                                            fieldState.error
                                                                ? "ring-1 ring-red-600"
                                                                : ""
                                                        }`}
                                                    >
                                                        <SelectValue
                                                            placeholder="Select Work Type"
                                                            {...field}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        position="popper"
                                                        className="max-h-[200px] overflow-y-auto"
                                                    >
                                                        {workTypes.map((workType, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={workType}
                                                            >
                                                                {workType}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className={`text-red-600`} />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        {selectedSubmissionObjectType === "Project" && (
                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field, fieldState }) => {
                                    const { value, ...restFieldProps } = field;
                                    return (
                                        <FormItem className="py-2">
                                            <FormLabel htmlFor="projectId">Project</FormLabel>
                                            <FormControl>
                                                <ProjectSelection
                                                    initialProjectId={initialProjectId || 0}
                                                    restFieldProps={restFieldProps}
                                                    createNewOn={createNewOn}
                                                    inputClassName={`${
                                                        fieldState.error
                                                            ? "ring-1 ring-red-600"
                                                            : ""
                                                    }`}
                                                />
                                            </FormControl>
                                            <FormMessage className={`text-red-600`} />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}
                        {selectedSubmissionObjectType === "Work" && (
                            <FormField
                                control={form.control}
                                name="workId"
                                render={({ field, fieldState }) => {
                                    const { value, ...restFieldProps } = field;
                                    return (
                                        <FormItem className="py-2">
                                            <FormLabel htmlFor="workId">
                                                {(selectedWorkType || "Work") + " *"}
                                            </FormLabel>
                                            <FormControl>
                                                <WorkSelection
                                                    restFieldProps={restFieldProps}
                                                    createNewOn={createNewOn}
                                                    inputClassName={`${
                                                        fieldState.error
                                                            ? "ring-1 ring-red-600"
                                                            : ""
                                                    }`}
                                                />
                                            </FormControl>
                                            <FormMessage className={`text-red-600`} />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}
                        {selectedSubmissionObjectType === "Work" &&
                            !projectId &&
                            projectId !== 0 && (
                                <FormField
                                    control={form.control}
                                    name="projectSubmissionId"
                                    render={({ field, fieldState }) => {
                                        const { value, ...restFieldProps } = field;
                                        return (
                                            <FormItem className="py-2">
                                                <FormLabel htmlFor="projectSubmissionId">
                                                    {"Associated Project Submission *"}
                                                </FormLabel>
                                                <FormControl>
                                                    <ProjectSubmissionSelection
                                                        restFieldProps={restFieldProps}
                                                        createNewOn={createNewOn}
                                                        inputClassName={`${
                                                            fieldState.error
                                                                ? "ring-1 ring-red-600"
                                                                : ""
                                                        }`}
                                                        projectId={projectId || 0}
                                                    />
                                                </FormControl>
                                                <FormMessage className={`text-red-600`} />
                                            </FormItem>
                                        );
                                    }}
                                />
                            )}

                        <div className="flex items-start">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full pr-2 py-2">
                                        <div>
                                            <FormLabel htmlFor="title">
                                                Submission Title *
                                            </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input
                                                id="title"
                                                placeholder="Title of your submission"
                                                className={`${
                                                    fieldState.error ? "ring-1 ring-red-600" : ""
                                                }`}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={`text-red-600`} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="public"
                                render={({ field }) => (
                                    <div className="pl-4 pr-2 py-2">
                                        <FormItem>
                                            <div className="pb-2 whitespace-nowrap">
                                                <FormLabel htmlFor="public">
                                                    {field.value === false ? "Private" : "Public"}
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    id="public"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </div>
                                )}
                            />
                        </div>
                        {selectedProjectId !== 0 && (
                            <FormField
                                control={form.control}
                                name="initialProjectVersionId"
                                render={({ field, fieldState }) => (
                                    <FormItem className="py-4">
                                        <FormLabel htmlFor="initialProjectVersionId">
                                            Project Submission Initial Version *
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <Select
                                                    onValueChange={
                                                        handleSelectInitialProjectVersionChange
                                                    }
                                                    value={
                                                        selectedProjectVersionId.toString() || "0"
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id="initialProjectVersionId"
                                                        className={`${
                                                            fieldState.error
                                                                ? "ring-1 ring-red-600"
                                                                : ""
                                                        }`}
                                                    >
                                                        <SelectValue
                                                            placeholder="Select Initial Project Version"
                                                            {...field}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        position="popper"
                                                        className="max-h-[200px] overflow-y-auto"
                                                    >
                                                        <SelectItem
                                                            value={
                                                                currentProjectVersionId?.toString() ||
                                                                "0"
                                                            }
                                                            className="p-2"
                                                        >
                                                            <div className="flex ml-8">
                                                                <div>{currentProjectVersionId}</div>
                                                                <div className="pl-4 text-gray-600 text-sm">
                                                                    Current Project Version
                                                                </div>
                                                            </div>
                                                        </SelectItem>

                                                        {projectVersionsData?.data.map(
                                                            (version, index) =>
                                                                Number(currentProjectVersionId) !=
                                                                    version.id && (
                                                                    <SelectItem
                                                                        key={index}
                                                                        value={
                                                                            version.id.toString() ||
                                                                            "0"
                                                                        }
                                                                        className="p-2"
                                                                    >
                                                                        <div className="ml-8">
                                                                            {version.id}
                                                                        </div>
                                                                    </SelectItem>
                                                                )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <button
                                                    type="button"
                                                    className="bg-white text-blue-600 h-10 flex whitespace-nowrap hover:bg-gray-200 hover:text-blue-600 rounded-md shadow-sm"
                                                    onClick={handleGraphExpand}
                                                >
                                                    {isGraphExpanded
                                                        ? "Close Project Graph"
                                                        : "View Project Graph"}
                                                </button>
                                            </div>
                                            {/* <Input
                                                    id="initialProjectVersionId"
                                                    placeholder="Initial Version Id"
                                                    {...field}
                                                /> */}
                                        </FormControl>
                                        <FormMessage className={`text-red-600`} />
                                        {isGraphExpanded && (
                                            <div className="relative z-50">
                                                <div
                                                    className="relative max-h-40"
                                                    style={{
                                                        overflowX: isGraphExpanded
                                                            ? "auto"
                                                            : "hidden",
                                                    }}
                                                >
                                                    <ProjectVersionGraph
                                                        projectGraph={
                                                            projectGraph || {
                                                                id: 0,
                                                                projectId: "",
                                                                graphData: {},
                                                            }
                                                        }
                                                        selectedVersionId={
                                                            selectedProjectVersionId.toString() ||
                                                            "0"
                                                        }
                                                        handleSelectGraphNode={
                                                            handleSelectProjectGraphNode
                                                        }
                                                        expanded={isGraphExpanded}
                                                        className="h-40"
                                                    />
                                                </div>
                                                <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-r from-white to-transparent z-0"></div>
                                                <div className="absolute top-0 right-0 bottom-0 w-2 bg-gradient-to-l from-white to-transparent z-0"></div>
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />
                        )}
                        {selectedWorkId !== 0 && (
                            <FormField
                                control={form.control}
                                name="initialWorkVersionId"
                                render={({ field, fieldState }) => (
                                    <FormItem className="py-4">
                                        <FormLabel htmlFor="initialWorkVersionId">
                                            Work Submission Initial Version *
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={handleSelectInitialWorkVersionChange}
                                                value={selectedWorkVersionId.toString() || "0"}
                                            >
                                                <SelectTrigger
                                                    id="initialWorkVersionId"
                                                    className={`${
                                                        fieldState.error
                                                            ? "ring-1 ring-red-600"
                                                            : ""
                                                    }`}
                                                >
                                                    <SelectValue
                                                        placeholder="Select Initial Work Version"
                                                        {...field}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent
                                                    position="popper"
                                                    className="max-h-[200px] overflow-y-auto"
                                                >
                                                    {worksVersionsData?.data.map(
                                                        (version, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={version.id.toString() || "0"}
                                                                className="p-2"
                                                            >
                                                                <div className="ml-8">
                                                                    {version.id}
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className={`text-red-600`} />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormItem className="flex items-center pb-2">
                            <FormLabel htmlFor="finalProjectVersionId">
                                Submission Final Version
                            </FormLabel>
                            <Input
                                value={"Auto-generated"}
                                readOnly
                                className="h-10 w-64 text-gray-700 mb-2 ml-2 focus:outline-none focus:ring-0"
                            />
                        </FormItem>
                        <FormField
                            control={form.control}
                            name="users"
                            render={({ field }) => {
                                const { value, ...restFieldProps } = field;
                                return (
                                    <FormItem className="pb-4">
                                        <FormLabel htmlFor="users">Authors</FormLabel>

                                        <FormControl>
                                            <UsersSelection
                                                restFieldProps={restFieldProps}
                                                createNewOn={createNewOn}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <div className="flex justify-end mt-6">
                            <button type="submit" className="standard-write-button">
                                Create Submission
                            </button>
                        </div>
                    </form>
                </Form>
            </CardContent>
            {isCreateLoading && <LoadingSpinner />}
        </Card>
    );
};

export default CreateSubmissionForm;
