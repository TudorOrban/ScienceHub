import {
    ProjectGraph,
    ProjectSubmission,
    ProjectVersion,
    WorkSubmission,
} from "@/types/versionControlTypes";
import { useCreateGeneralData } from "../../app/hooks/create/useCreateGeneralData";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
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
import { useCreateGeneralManyToManyEntry } from "../../app/hooks/create/useCreateGeneralManyToManyEntry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useProjectGraph from "../../app/version-control-system/hooks/useProjectGraph";
import { User } from "@/types/userTypes";
import React from "react";
import { useUpdateGeneralData } from "../../app/hooks/update/useUpdateGeneralData";
import { useProjectSelectionContext } from "@/app/contexts/selections/ProjectSelectionContext";
import { useWorkSelectionContext } from "@/app/contexts/selections/WorkSelectionContext";
import { useUsersSelectionContext } from "@/app/contexts/selections/UsersSelectionContext";
import { workTypes } from "@/utils/navItems.config";
import { Switch } from "../ui/switch";
import { toast } from "../ui/use-toast";
import ToasterManager, { Operation } from "./form-elements/ToasterManager";
import { useUserId } from "@/app/contexts/current-user/UserIdContext";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import dynamic from "next/dynamic";
import { useProjectVersionsSearch } from "@/app/hooks/fetch/search-hooks/management/useProjectVersionsSearch";
import { useWorkVersionsSearch } from "@/app/hooks/fetch/search-hooks/management/useWorkVersionsSearch";
const ProjectSelection = dynamic(() => import("./form-elements/ProjectSelection"));
const WorkSelection = dynamic(() => import("./form-elements/WorkSelection"));
const UsersSelection = dynamic(() => import("./form-elements/UsersSelection"));
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

const CreateSubmissionForm: React.FC<CreateSubmissionFormProps> = (props) => {
    // States
    const [selectedSubmissionObjectType, setSelectedSubmissionObjectType] = useState<string>(
        props.initialSubmissionObjectType || ""
    );
    const [selectedProjectVersionId, setSelectedProjectVersionId] = useState<string>(
        props.currentProjectVersionId || ""
    );
    const [selectedWorkVersionId, setSelectedWorkVersionId] = useState<string>(
        props.currentWorkVersionId || ""
    );
    const [isGraphExpanded, setIsGraphExpanded] = useState<boolean>(false);

    // Contexts
    // - Supabase client
    const supabase = useSupabaseClient();

    // - Current user id
    const currentUserId = useUserId();

    // - Selected Project, Work and Users contexts
    const { selectedProjectId, setSelectedProjectId } = useProjectSelectionContext();
    const { selectedWorkType, setSelectedWorkType, selectedWorkId, setSelectedWorkId } =
        useWorkSelectionContext();
    const { selectedUsersIds, setSelectedUsersIds } = useUsersSelectionContext();

    // Hooks
    const projectVersionsData = useProjectVersionsSearch({
        extraFilters: { project_id: selectedProjectId },
        enabled: !!selectedProjectId,
        context: props.context || "Project General",
    });

    const worksVersionsData = useWorkVersionsSearch({
        extraFilters: { users: currentUserId },
        enabled: !!currentUserId,
        context: props.context || "Project General",
    });

    const {
        projectGraph,
        isLoading: projectGraphLoading,
        error: projectGraphError,
    } = useProjectGraph(Number(selectedProjectId || 0), !!selectedProjectId);

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
    const createProjectSubmission = useCreateGeneralData<ProjectSubmission>();
    const createWorkSubmission = useCreateGeneralData<WorkSubmission>();
    const createVersion = useCreateGeneralData<Partial<ProjectVersion>>();
    const createProjectSubmissionUsers = useCreateGeneralManyToManyEntry();
    const createWorkSubmissionUsers = useCreateGeneralManyToManyEntry();
    const { mutateAsync: updateProjectGraphMutation } = useUpdateGeneralData<ProjectGraph>();

    const handleCreateSubmission = async (formData: any) => {
        try {
            const {
                submissionObjectType,
                projectId,
                workType,
                workId,
                initial_project_version_id,
                final_project_version_id,
                initial_work_version_id,
                final_work_version_id,
                users,
                ...submissionData
            } = formData;

            // For handling operation outcome
            let newVersionId: number | null = null;
            let newSubmissionId: number | null = null;
            let newSubmissionUsersIds: (number | null)[] = [];

            switch (submissionObjectType) {
                case "Project":
                    if (projectId !== null && projectId !== undefined && projectId !== "") {
                        // Generate final version
                        const newVersion = await createVersion.mutateAsync({
                            supabase,
                            tableName: "project_versions",
                            input: {
                                project_id: projectId,
                            } as any,
                        });

                        if (newVersion.id) {
                            newVersionId = newVersion.id;

                            let projectSubmissionCreationData = {
                                project_id: projectId,
                                initial_project_version_id: initial_project_version_id,
                                final_project_version_id: newVersionId,
                                ...submissionData,
                            };

                            // Create submission
                            const newSubmission = await createProjectSubmission.mutateAsync({
                                supabase,
                                tableName: "project_submissions",
                                input: projectSubmissionCreationData,
                            });

                            // Create corresponding users
                            if (newSubmission.id) {
                                newSubmissionId = newSubmission.id;

                                for (const userId of users) {
                                    const newSubmissionUsers =
                                        (await createProjectSubmissionUsers.mutateAsync({
                                            supabase,
                                            tableName: "project_submission_users",
                                            firstEntityColumnName: "project_submission_id",
                                            firstEntityId: newSubmission.id,
                                            secondEntityColumnName: "user_id",
                                            secondEntityId: userId,
                                        })) as any;

                                    if (newSubmissionUsers) {
                                        newSubmissionUsersIds.push(
                                            newSubmissionUsers.data?.user_id || null
                                        );
                                    } else {
                                        newSubmissionUsersIds.push(null);
                                    }
                                }

                                // Update project version graph
                                const updatedGraph = updateProjectGraph(
                                    projectGraph || {
                                        id: 0,
                                        projectId: projectId || "",
                                        graphData: {},
                                    },
                                    selectedProjectVersionId,
                                    (newVersion?.id || "").toString()
                                );

                                const updateFieldsSnakeCase: Partial<ProjectGraph> = {
                                    id: projectGraph?.id || 0,
                                    project_id: projectGraph?.projectId || 0,
                                    graph_data: updatedGraph?.graphData || {},
                                } as unknown as Partial<ProjectGraph>;

                                await updateProjectGraphMutation({
                                    supabase: supabase,
                                    tableName: "project_versions_graphs",
                                    identifierField: "id",
                                    identifier: projectGraph?.id || 0,
                                    updateFields: updateFieldsSnakeCase,
                                });
                            }
                        }
                    }
                    break;
                case "Work":
                    if (workId !== null && workId !== undefined && workId !== "") {
                        // Generate final version
                        const newVersion = await createVersion.mutateAsync({
                            supabase,
                            tableName: "work_versions",
                            input: {
                                work_type: workType,
                                work_id: workId,
                            } as Partial<ProjectVersion>,
                        });

                        if (newVersion.id) {
                            newVersionId = newVersion.id;

                            let workSubmissionCreationData = {
                                work_id: workId,
                                initial_work_version_id: initial_work_version_id,
                                final_work_version_id: newVersionId,
                                ...submissionData,
                            };

                            // Create submission
                            const newSubmission = await createWorkSubmission.mutateAsync({
                                supabase,
                                tableName: "work_submissions",
                                input: workSubmissionCreationData,
                            });

                            // Create corresponding users
                            if (newSubmission.id) {
                                newSubmissionId = newSubmission.id;

                                for (const userId of users) {
                                    const newSubmissionUsers =
                                        (await createWorkSubmissionUsers.mutateAsync({
                                            supabase,
                                            tableName: "work_submission_users",
                                            firstEntityColumnName: "work_submission_id",
                                            firstEntityId: newSubmission.id,
                                            secondEntityColumnName: "user_id",
                                            secondEntityId: userId,
                                        })) as any;

                                    if (newSubmissionUsers) {
                                        newSubmissionUsersIds.push(
                                            newSubmissionUsers.data?.user_id || null
                                        );
                                    } else {
                                        newSubmissionUsersIds.push(null);
                                    }
                                }
                            }
                        }
                    }

                    break;
            }

            // Handle operation outcome
            const createVersionOperation: Operation = {
                operationType: "create",
                entityType: "Final version",
                id: newVersionId,
            };

            const createSubmissionOperation: Operation = {
                operationType: "create",
                entityType: "Submission",
                id: newSubmissionId,
            };
            const createSubmissionUsersOperation: Operation[] = newSubmissionUsersIds.map(
                (userId) => ({
                    operationType: "create",
                    entityType: "Submission users",
                    id: userId,
                })
            );

            toast({
                action: (
                    <ToasterManager
                        operations={[
                            createVersionOperation,
                            createSubmissionOperation,
                            // createProjectIssueOperation,
                            ...createSubmissionUsersOperation,
                        ]}
                        mainOperation={createSubmissionOperation}
                    />
                ),
            });

            props.onCreateNew();
        } catch (error) {
            console.log("An error occured: ", error);
        }
    };

    // Form
    const CreateSubmissionSchema = z
        .object({
            submissionObjectType: z
                .string()
                .min(1, { message: "Submission Object Type is required." }),
            projectId: z.string(),
            workType: z.string(),
            workId: z.string(),
            title: z.string().min(1, { message: "Title is required." }).max(100, {
                message: "Title must be less than 100 characters long.",
            }),
            description: z.string(),
            initial_project_version_id: z.number(),
            initial_work_version_id: z.number(),
            final_project_version_id: z.number(),
            final_work_version_id: z.number(),
            users: z.array(z.string()).min(1, { message: "At least one user is required." }),
            public: z.boolean(),
        })
        .superRefine((data, ctx) => {
            if (data.submissionObjectType === "Work") {
                if (!data.workType) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Work Type is required",
                        path: [...ctx.path, "workType"], // specify that the error is for the 'workType' field
                    });
                }
                if (!data.workId) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Work is required",
                        path: [...ctx.path, "workId"], // specify that the error is for the 'workId' field
                    });
                }
                if (!data.initial_work_version_id) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Initial Work Version is required",
                        path: [...ctx.path, "initial_work_version_id"],
                    });
                }
            }

            if (data.submissionObjectType === "Project") {
                console.log("INSIDE PROJECT");

                if (!data.projectId) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Project is required",
                        path: [...ctx.path, "projectId"],
                    });
                }

                if (!data.initial_project_version_id) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Initial Project Version is required",
                        path: [...ctx.path, "initial_project_version_id"],
                    });
                }
            }
        });

    const defaultUsers: string[] = [];

    const form = useForm<z.infer<typeof CreateSubmissionSchema>>({
        resolver: zodResolver(CreateSubmissionSchema),
        defaultValues: {
            submissionObjectType: props.initialSubmissionObjectType || "",
            workType: "",
            workId: "",
            projectId: props.initialProjectId || "",
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

    return (
        <div>
            <Card className="w-[800px] h-[500px] overflow-y-auto">
                <div className="flex justify-between border-b border-gray-300 sticky bg-white top-0 z-60">
                    <CardTitle className="pt-6 pl-4 pb-6">Create Submission Form</CardTitle>
                    <div className="pt-4 pr-2">
                        <Button
                            className="bg-gray-50 border border-gray-300 text-gray-800 flex justify-center w-10 h-10 hover:bg-red-700"
                            onClick={props.onCreateNew}
                        >
                            <FontAwesomeIcon icon={faXmark} className="small-icon" />
                        </Button>
                    </div>
                </div>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreateSubmission)}>
                            <div className="flex items-start w-full p-4 space-x-4">
                                <FormField
                                    control={form.control}
                                    name="submissionObjectType"
                                    render={({ field, fieldState }) => (
                                        <div className="w-[350px]">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="submissionObjectType">
                                                        Submission for *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <div className="flex items-center">
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
                                                                    (
                                                                        submissionObjectType,
                                                                        index
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={index}
                                                                            value={
                                                                                submissionObjectType
                                                                            }
                                                                        >
                                                                            {submissionObjectType}
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className={`text-red-600`} />
                                            </FormItem>
                                        </div>
                                    )}
                                />
                                {selectedSubmissionObjectType === "Work" && (
                                    <FormField
                                        control={form.control}
                                        name="workType"
                                        render={({ field, fieldState }) => (
                                            <div className="w-[350px] pr-2">
                                                <FormItem>
                                                    <div className="pb-1">
                                                        <FormLabel htmlFor="workType">
                                                            Work Type *
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <div className="flex items-center">
                                                            <Select
                                                                onValueChange={
                                                                    handleSelectWorkTypeChange
                                                                }
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
                                                                    {workTypes.map(
                                                                        (workType, index) => (
                                                                            <SelectItem
                                                                                key={index}
                                                                                value={workType}
                                                                            >
                                                                                {workType}
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className={`text-red-600`} />
                                                </FormItem>
                                            </div>
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
                                            <div className="pl-4 pb-6">
                                                <FormItem>
                                                    <div className="pb-4">
                                                        <FormLabel htmlFor="projectId">
                                                            Project
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <ProjectSelection
                                                            initialProjectId={
                                                                props.initialProjectId || ""
                                                            }
                                                            restFieldProps={restFieldProps}
                                                            createNewOn={props.createNewOn}
                                                            inputClassName={`${
                                                                fieldState.error
                                                                    ? "ring-1 ring-red-600"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className={`text-red-600 pt-4`} />
                                                </FormItem>
                                            </div>
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
                                            <div className="pl-4 pb-4">
                                                <FormItem>
                                                    <div className="pb-4">
                                                        <FormLabel htmlFor="workId">
                                                            {(selectedWorkType || "Work") + " *"}
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <WorkSelection
                                                            restFieldProps={restFieldProps}
                                                            createNewOn={props.createNewOn}
                                                            inputClassName={`${
                                                                fieldState.error
                                                                    ? "ring-1 ring-red-600"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className={`text-red-600 pt-4`} />
                                                </FormItem>
                                            </div>
                                        );
                                    }}
                                />
                            )}
                            <div className="flex items-start">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field, fieldState }) => (
                                        <div className="w-full pl-4 pr-2 pt-2 pb-2">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="title">
                                                        Submission Title *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        id="title"
                                                        placeholder="Title of your submission"
                                                        className={`${
                                                            fieldState.error
                                                                ? "ring-1 ring-red-600"
                                                                : ""
                                                        }`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className={`text-red-600`} />
                                            </FormItem>
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="public"
                                    render={({ field }) => (
                                        <div className="pl-4 pr-6 py-2">
                                            <FormItem>
                                                <div className="pb-2 whitespace-nowrap">
                                                    <FormLabel htmlFor="public">
                                                        {field.value === false
                                                            ? "Private"
                                                            : "Public"}
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
                                        <div className="p-4">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="initial_project_version_id">
                                                        Submission Initial Version *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <Select
                                                            onValueChange={
                                                                handleSelectInitialProjectVersionChange
                                                            }
                                                            value={
                                                                selectedProjectVersionId ||
                                                                "default"
                                                            } // or value={selectedVersionId} if it's a controlled component
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
                                                                        props.currentProjectVersionId?.toString() ||
                                                                        "default"
                                                                    }
                                                                    className="p-2"
                                                                >
                                                                    <div className="flex ml-8">
                                                                        <div>
                                                                            {
                                                                                props.currentProjectVersionId
                                                                            }
                                                                        </div>
                                                                        <div className="pl-4 text-gray-600 text-sm">
                                                                            Current Project Version
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>

                                                                {projectVersionsData?.data.map(
                                                                    (version, index) =>
                                                                        Number(
                                                                            props.currentProjectVersionId
                                                                        ) != version.id && (
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
                                                        className="relative"
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
                                                                selectedProjectVersionId
                                                            }
                                                            handleSelectGraphNode={
                                                                handleSelectProjectGraphNode
                                                            }
                                                            expanded={isGraphExpanded}
                                                        />
                                                    </div>
                                                    <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-0"></div>
                                                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-0"></div>
                                                </div>
                                                \\
                                            </FormItem>
                                        </div>
                                    )}
                                />
                            )}
                            {selectedWorkId && (
                                <FormField
                                    control={form.control}
                                    name="initial_work_version_id"
                                    render={({ field, fieldState }) => (
                                        <div className="p-4">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="initial_work_version_id">
                                                        Submission Initial Version *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <Select
                                                            onValueChange={
                                                                handleSelectInitialWorkVersionChange
                                                            }
                                                            value={
                                                                selectedWorkVersionId || "default"
                                                            } // or value={selectedVersionId} if it's a controlled component
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
                                                    </div>
                                                </FormControl>
                                                <FormMessage className={`text-red-600`} />
                                            </FormItem>
                                        </div>
                                    )}
                                />
                            )}
                            <div className="pb-2 pl-4">
                                <FormItem className="flex items-center">
                                    <FormLabel htmlFor="final_project_version_id">
                                        Submission Final Version
                                    </FormLabel>
                                    <div className="pl-2">
                                        <Input
                                            value={"Auto-generated"}
                                            readOnly
                                            className="h-10 w-64 text-gray-700 mb-2"
                                        />
                                    </div>
                                </FormItem>
                            </div>
                            <FormField
                                control={form.control}
                                name="users"
                                render={({ field }) => {
                                    const { value, ...restFieldProps } = field;
                                    return (
                                        <div className="pl-4 pr-6 pb-4">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="users">Authors</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <UsersSelection
                                                        restFieldProps={restFieldProps}
                                                        createNewOn={props.createNewOn}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </div>
                                    );
                                }}
                            />

                            <div className="flex justify-end mt-16 pr-6">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Create Submission
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateSubmissionForm;

const updateProjectGraph = (
    projectGraph: ProjectGraph,
    initialVersionId: string,
    finalVersionId: string
): ProjectGraph => {
    // Clone the existing graph
    const updatedGraph: ProjectGraph = JSON.parse(JSON.stringify(projectGraph));

    // Update the initial version's neighbors to include the new final version
    if (updatedGraph.graphData[initialVersionId]) {
        updatedGraph.graphData[initialVersionId].neighbors.push(finalVersionId);
    } else {
        updatedGraph.graphData[initialVersionId] = {
            neighbors: [finalVersionId],
        };
    }

    // Add the new version node with the initial version as its neighbor
    updatedGraph.graphData[finalVersionId] = {
        neighbors: [initialVersionId],
        isSnapshot: false,
    };

    return updatedGraph;
};
