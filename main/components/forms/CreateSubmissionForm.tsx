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
import { useCreateGeneralManyToManyEntry } from "@/hooks/create/useCreateGeneralManyToManyEntry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useProjectGraph from "@/version-control-system/hooks/useProjectGraph";
import React from "react";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
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
const ProjectSelection = dynamic(() => import("./form-elements/ProjectSelection"));
const WorkSelection = dynamic(() => import("./form-elements/WorkSelection"));
const ProjectVersionGraph = dynamic(
    () => import("@/components/visualizations/ProjectVersionGraph")
);

interface CreateSubmissionFormProps {
    initialSubmissionObjectType?: string;
    initialProjectId?: string;
    currentProjectVersionId?: string;
    currentWorkVersionId?: string;
    createNewOn?: boolean;
    onCreateNew: () => void;
    context?: string;
}

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
    const [selectedProjectVersionId, setSelectedProjectVersionId] = useState<string>(
        currentProjectVersionId || ""
    );
    const [selectedWorkVersionId, setSelectedWorkVersionId] = useState<string>(
        currentWorkVersionId || ""
    );
    const [isGraphExpanded, setIsGraphExpanded] = useState<boolean>(false);

    // Contexts
    // - Current user id
    const currentUserId = useUserId();

    // - Toasts
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
        extraFilters: { users: currentUserId },
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
        setSelectedProjectId("");
        setSelectedWorkId("");
    };

    const handleSelectWorkTypeChange = (value: any) => {
        form.setValue("workType", value);
        form.trigger("workType");
        setSelectedWorkType(value);
    };

    const handleSelectInitialProjectVersionChange = (value: any) => {
        form.setValue("initial_project_version_id", value);
        form.trigger("initial_project_version_id");
        setSelectedProjectVersionId(value);
    };

    const handleSelectInitialWorkVersionChange = (value: any) => {
        form.setValue("initial_work_version_id", value);
        form.trigger("initial_work_version_id");
        setSelectedWorkVersionId(value);
    };

    const handleSelectProjectGraphNode = (versionId: string) => {
        setSelectedProjectVersionId(versionId);
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
        form.setValue("initial_project_version_id", Number(selectedProjectVersionId));
        form.trigger("initial_project_version_id");
    }, [selectedProjectVersionId]);

    useEffect(() => {
        form.setValue("initial_work_version_id", Number(selectedWorkVersionId));
        form.trigger("initial_work_version_id");
    }, [selectedWorkVersionId]);

    useEffect(() => {
        form.setValue("users", selectedUsersIds);
        form.trigger("users");
    }, [selectedUsersIds]);

    // Handle Submission creation
    const createGeneral = useCreateGeneralData();
    const createGeneralManyToMany = useCreateGeneralManyToManyEntry();
    const updateGeneral = useUpdateGeneralData();

    // Form
    const defaultUsers: string[] = [];

    const form = useForm<z.infer<typeof CreateSubmissionSchema>>({
        resolver: zodResolver(CreateSubmissionSchema),
        defaultValues: {
            submissionObjectType: initialSubmissionObjectType || "",
            workType: "",
            workId: "",
            projectId: initialProjectId || "",
            projectSubmissionId: "",
            title: "",
            description: "",
            initial_project_version_id: 0,
            initial_work_version_id: 0,
            final_project_version_id: 0,
            final_work_version_id: 0,
            users: defaultUsers,
            public: false,
        },
    });

    // Submit
    const onSubmit = async (formData: CreateSubmissionFormData) => {
        try {
            await handleCreateSubmission({
                createGeneral,
                createGeneralManyToMany,
                updateGeneral,
                projectGraph,
                onCreateNew: onCreateNew,
                setOperations: setOperations,
                formData,
            });
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };

    return (
        <Card className="w-[800px] h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-300 sticky bg-white top-0 z-50">
                <CardTitle className="py-6 pl-12">Create Submission Form</CardTitle>
                <div className="pr-10">
                    <Button className="dialog-close-button" onClick={onCreateNew}>
                        <FontAwesomeIcon icon={faXmark} className="small-icon" />
                    </Button>
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
                                        <FormItem className="pb-4">
                                            <FormLabel htmlFor="projectId">Project</FormLabel>
                                            <FormControl>
                                                <ProjectSelection
                                                    initialProjectId={initialProjectId || ""}
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
                                        <FormItem className="pb-6">
                                            <div className="pb-4">
                                                <FormLabel htmlFor="workId">
                                                    {(selectedWorkType || "Work") + " *"}
                                                </FormLabel>
                                            </div>
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
                                            <FormMessage className={`text-red-600 pt-4`} />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}
                        {selectedSubmissionObjectType === "Work" && !!projectId && (
                            <FormField
                                control={form.control}
                                name="projectSubmissionId"
                                render={({ field, fieldState }) => {
                                    const { value, ...restFieldProps } = field;
                                    return (
                                        <FormItem className="py-4">
                                            <FormLabel htmlFor="projectSubmissionId">
                                                {"Project Submission *"}
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
                                                    projectId={projectId.toString()}
                                                />
                                            </FormControl>
                                            <FormMessage className={`text-red-600 pt-4`} />
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
                                    <FormItem className="w-full pr-2 pt-2 pb-2">
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
                        {selectedProjectId && (
                            <FormField
                                control={form.control}
                                name="initial_project_version_id"
                                render={({ field, fieldState }) => (
                                    <FormItem className="py-4">
                                        <FormLabel htmlFor="initial_project_version_id">
                                            Submission Initial Version *
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <Select
                                                    onValueChange={
                                                        handleSelectInitialProjectVersionChange
                                                    }
                                                    value={selectedProjectVersionId || "default"} // or value={selectedVersionId} if it's a controlled component
                                                >
                                                    <SelectTrigger
                                                        id="initial_project_version_id"
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
                                                                "default"
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
                                                                        value={version.id.toString()}
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
                                                <Button
                                                    type="button"
                                                    className="bg-white text-blue-600 h-10 flex whitespace-nowrap hover:bg-gray-200 hover:text-blue-600"
                                                    onClick={handleGraphExpand}
                                                >
                                                    {isGraphExpanded
                                                        ? "Close Project Graph"
                                                        : "View Project Graph"}
                                                </Button>
                                            </div>
                                            {/* <Input
                                                    id="initial_project_version_id"
                                                    placeholder="Initial Version Id"
                                                    {...field}
                                                /> */}
                                        </FormControl>
                                        <FormMessage className={`text-red-600`} />
                                        <div className="relative z-50">
                                            <div
                                                className="relative max-h-20"
                                                style={{
                                                    overflowX: isGraphExpanded ? "auto" : "hidden",
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
                                                    selectedVersionId={selectedProjectVersionId}
                                                    handleSelectGraphNode={
                                                        handleSelectProjectGraphNode
                                                    }
                                                    expanded={isGraphExpanded}
                                                />
                                            </div>
                                            <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-r from-white to-transparent z-0"></div>
                                            <div className="absolute top-0 right-0 bottom-0 w-2 bg-gradient-to-l from-white to-transparent z-0"></div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        )}
                        {selectedWorkId && (
                            <FormField
                                control={form.control}
                                name="initial_work_version_id"
                                render={({ field, fieldState }) => (
                                    <FormItem className="py-4">
                                        <FormLabel htmlFor="initial_work_version_id">
                                            Submission Initial Version *
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={handleSelectInitialWorkVersionChange}
                                                value={selectedWorkVersionId || "default"}
                                            >
                                                <SelectTrigger
                                                    id="initial_work_version_id"
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
                                                                value={version.id.toString()}
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
                            <FormLabel htmlFor="final_project_version_id">
                                Submission Final Version
                            </FormLabel>
                            <Input
                                value={"Auto-generated"}
                                readOnly
                                className="h-10 w-64 text-gray-700 mb-2 ml-2"
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
        </Card>
    );
};

export default CreateSubmissionForm;
