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
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useCreateGeneralManyToManyEntry } from "@/app/hooks/create/useCreateGeneralManyToManyEntry";
import { useCreateGeneralData } from "@/app/hooks/create/useCreateGeneralData";
import { useToast } from "../ui/use-toast";
import { Switch } from "../ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { UsersSelectionContext } from "@/app/contexts/selections/UsersSelectionContext";
import ToasterManager, { Operation } from "./form-elements/ToasterManager";
import { ProjectSelectionContext } from "@/app/contexts/selections/ProjectSelectionContext";
import { Issue } from "@/types/managementTypes";
import { WorkSelectionContext } from "@/app/contexts/selections/WorkSelectionContext";
import { workTypes } from "@/utils/navItems.config";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
const ProjectSelection = dynamic(() => import("./form-elements/ProjectSelection"));
const UsersSelection = dynamic(() => import("./form-elements/UsersSelection"));
const WorkSelection = dynamic(() => import("./form-elements/WorkSelection"));

type InitialIssueValues = {
    initialIssueObjectType?: string;
    initialProjectId?: string;
    initialWorkType?: string;
    initialWorkId?: string;
    initialSubmissionId?: string;
}

interface CreateIssueFormProps {
    initialValues: InitialIssueValues;
    createNewOn?: boolean;
    onCreateNew: () => void;
}

const CreateIssueForm: React.FC<CreateIssueFormProps> = (props) => {
    // States
    const [selectedIssueObjectType, setSelectedIssueObjectType] =
        useState<string>(props.initialValues.initialIssueObjectType || "");

    // Hooks
    // Supabase client
    const supabase = useSupabaseClient();

    // Selected Project, Work and Users contexts
    const projectSelectionContext = useContext(ProjectSelectionContext);
    if (!projectSelectionContext) {
        throw new Error(
            "ProjectSelectionContext must be used within a Provider"
        );
    }
    const { selectedProjectId, setSelectedProjectId } = projectSelectionContext;

    const workSelectionContext = useContext(WorkSelectionContext);
    if (!workSelectionContext) {
        throw new Error(
            "ProjectSelectionContext must be used within a Provider"
        );
    }
    const {
        selectedWorkType,
        setSelectedWorkType,
        selectedWorkId,
        setSelectedWorkId,
    } = workSelectionContext;

    const usersSelectionContext = useContext(UsersSelectionContext);
    if (!usersSelectionContext) {
        throw new Error("UsersSelectionContext must be used within a Provider");
    }
    const { selectedUsersIds, setSelectedUsersIds } = usersSelectionContext;

    // Handles
    // Handle issue type and selection
    const issueObjectTypes = ["Project", "Work", "Submission"];

    const handleSelectIssueObjectTypeChange = (value: any) => {
        form.setValue("issueObjectType", value);
        form.trigger("issueObjectType");
        setSelectedIssueObjectType(value);
    };

    const handleSelectWorkTypeChange = (value: any) => {
        form.setValue("workType", value);
        form.trigger("workType");
        setSelectedWorkType(value);
    };

    // Handle project selection and data
    useEffect(() => {
        form.setValue("issueObjectType", selectedIssueObjectType);
        form.trigger("issueObjectType");
    }, [selectedIssueObjectType]);

    useEffect(() => {
        form.setValue("projectId", selectedProjectId);
        form.trigger("projectId");
    }, [selectedProjectId]);

    // Handle work selection and data
    useEffect(() => {
        form.setValue("workType", selectedWorkType);
        form.trigger("workType");
    }, [selectedWorkType]);

    useEffect(() => {
        form.setValue("workId", selectedWorkId);
        form.trigger("workId");
    }, [selectedWorkId]);

    // Handle users selection
    useEffect(() => {
        form.setValue("users", selectedUsersIds);
    }, [selectedUsersIds]);

    // Handle Project creation
    const createIssue = useCreateGeneralData<Partial<Issue>>();
    const createIssueUsers = useCreateGeneralManyToManyEntry();
    const { toast } = useToast();

    const handleCreateIssue = async (
        formData: z.infer<typeof CreateIssueSchema>
    ) => {
        try {
            const {
                issueObjectType,
                projectId,
                workType,
                workId,
                users,
                ...issueData
            } = formData;

            // For handling database names
            const {
                label,
                tableName,
                tableNameForIntermediate,
                intermediateTable,
            } = getIssueTypeInfo(issueObjectType, "users");

            // For handling operation outcome
            let newIssueId: number | null = null;
            let newIssueUsersIds: (number | null)[] = [];

            let issueCreationData = {
                object_type: "",
                object_id: "",
                title: "",
                description: "",
                public: false,
            };

            switch (issueObjectType) {
                case "Project":
                    if (
                        projectId !== null &&
                        projectId !== undefined &&
                        projectId !== ""
                    ) {
                        issueCreationData = {
                            object_type: "Project",
                            object_id: projectId,
                            title: formData.title,
                            description: formData.description,
                            public: formData.public,
                        };
                    }
                    break;
                case "Work":
                    if (
                        workId !== null &&
                        workId !== undefined &&
                        workId !== "" &&
                        workType !== ""
                    ) {
                        issueCreationData = {
                            object_type: workType,
                            object_id: workId,
                            title: formData.title,
                            description: formData.description,
                            public: formData.public,
                        };
                    }
                    break;
                case "Submission":
                    if (
                        workId !== null &&
                        workId !== undefined &&
                        workId !== "" &&
                        workType !== ""
                    ) {
                        issueCreationData = {
                            object_type: "Submission",
                            object_id: workId,
                            title: formData.title,
                            description: formData.description,
                            public: formData.public,
                        };
                    }
                    break;
            }
            // Create issue
            const newIssue = await createIssue.mutateAsync({
                supabase,
                tableName: tableName || "",
                input: {
                    ...issueCreationData,
                    // research_score: 0,
                    // h_index: 0,
                    // total_citations_count: 0,
                } as Partial<Issue>,
            });

            // Create corresponding objects
            if (newIssue.id) {
                newIssueId = newIssue.id;

                // Add issue users and teams
                for (const userId of users) {
                    const intermediateTableName =
                        (tableNameForIntermediate || "") +
                        "_" +
                        intermediateTable;
                    const newIssueUsers = (await createIssueUsers.mutateAsync({
                        supabase,
                        tableName: `${intermediateTableName}`,
                        firstEntityColumnName: `${tableNameForIntermediate}_id`,
                        firstEntityId: newIssue.id,
                        secondEntityColumnName: `user_id`,
                        secondEntityId: userId,
                    })) as any;

                    if (newIssueUsers) {
                        newIssueUsersIds.push(
                            newIssueUsers.data?.user_id || null
                        );
                    } else {
                        newIssueUsersIds.push(null);
                    }
                }
            }
            // Handle operation outcome
            const createIssueOperation: Operation = {
                operationType: "create",
                entityType: issueObjectType + " Issue",
                id: newIssueId,
            };
            const createIssueUsersOperation: Operation[] = newIssueUsersIds.map(
                (userId) => ({
                    operationType: "create",
                    entityType: "Issue users",
                    id: userId,
                })
            );

            toast({
                action: (
                    <ToasterManager
                        operations={[
                            createIssueOperation,
                            // createProjectIssueOperation,
                            ...createIssueUsersOperation,
                        ]}
                        mainOperation={createIssueOperation}
                    />
                ),
            });

            props.onCreateNew();
        } catch (error) {
            console.log("An error occurred: ", error);
        }
    };

    // Zod validation schema
    const CreateIssueSchema = z
        .object({
            issueObjectType: z
                .string()
                .min(1, { message: "Issue Object Type is required." }),
            projectId: z.string(),
            workType: z.string(),
            workId: z.string(),
            title: z
                .string()
                .min(1, { message: "Title is required." })
                .max(100, {
                    message: "Title must be less than 100 characters long.",
                }),
            description: z.string(),
            users: z
                .array(z.string())
                .min(1, { message: "At least one user is required." }),
            public: z.boolean(),
        })
        .superRefine((data, ctx) => {
            if (data.issueObjectType === "Work") {
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
            }

            if (data.issueObjectType === "Project" && !data.projectId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Project is required",
                    path: [...ctx.path, "projectId"], // specify that the error is for the 'projectId' field
                });
            }
        });

    // Form
    const defaultUsers: string[] = [];
    
    const form = useForm<z.infer<typeof CreateIssueSchema>>({
        resolver: zodResolver(CreateIssueSchema),
        defaultValues: {
            issueObjectType: "",
            projectId: "",
            workType: "",
            workId: "",
            title: "",
            description: "",
            users: defaultUsers,
            // teams: [],
            public: false,
        },
    });

    return (
        <div>
            <Card className="w-[800px] h-[500px] overflow-y-auto">
                <div className="flex justify-between border-b border-gray-300 sticky bg-white top-0 z-80">
                    <CardTitle className="pt-6 pl-4 pb-6">
                        Create Issue Form
                    </CardTitle>
                    <div className="pt-4 pr-2">
                        <Button
                            className="bg-gray-50 border border-gray-300 text-gray-800 flex justify-center w-10 h-10 hover:bg-red-700"
                            onClick={props.onCreateNew}
                        >
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="small-icon"
                            />
                        </Button>
                    </div>
                </div>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreateIssue)}>
                            <div className="flex items-start w-full p-4 space-x-4">
                                <FormField
                                    control={form.control}
                                    name="issueObjectType"
                                    render={({ field, fieldState }) => (
                                        <div className="w-[350px]">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="issueObjectType">
                                                        Issue for *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <Select
                                                            onValueChange={
                                                                handleSelectIssueObjectTypeChange
                                                            }
                                                            value={
                                                                selectedIssueObjectType
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                id="issueObjectType"
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
                                                                className={`max-h-[200px] overflow-y-auto`}
                                                            >
                                                                {issueObjectTypes.map(
                                                                    (
                                                                        issueObjectType,
                                                                        index
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                index
                                                                            }
                                                                            value={
                                                                                issueObjectType
                                                                            }
                                                                        >
                                                                            {
                                                                                issueObjectType
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </FormControl>
                                                <FormMessage
                                                    className={`text-red-600`}
                                                />
                                            </FormItem>
                                        </div>
                                    )}
                                />
                                {selectedIssueObjectType === "Work" && (
                                    <FormField
                                        control={form.control}
                                        name="workType"
                                        render={({ field, fieldState }) => (
                                            <div className="w-[350px]">
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
                                                                value={
                                                                    selectedWorkType
                                                                }
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
                                                                        (
                                                                            workType,
                                                                            index
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    index
                                                                                }
                                                                                value={
                                                                                    workType
                                                                                }
                                                                            >
                                                                                {
                                                                                    workType
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage
                                                        className={`text-red-600`}
                                                    />
                                                </FormItem>
                                            </div>
                                        )}
                                    />
                                )}
                            </div>
                            {selectedIssueObjectType === "Project" && (
                                <FormField
                                    control={form.control}
                                    name="projectId"
                                    render={({ field, fieldState }) => {
                                        const { value, ...restFieldProps } =
                                            field;
                                        return (
                                            <div className="pl-4 pb-8">
                                                <FormItem>
                                                    <div className="pb-4">
                                                        <FormLabel htmlFor="projectId">
                                                            Project *
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <ProjectSelection
                                                            restFieldProps={
                                                                restFieldProps
                                                            }
                                                            createNewOn={
                                                                props.createNewOn
                                                            }
                                                            inputClassName={`${
                                                                fieldState.error
                                                                    ? "ring-1 ring-red-600"
                                                                    : ""
                                                            }`}
                                                            initialProjectId={props.initialValues.initialProjectId}
                                                        />
                                                    </FormControl>
                                                    <FormMessage
                                                        className={`text-red-600 pt-4`}
                                                    />
                                                </FormItem>
                                            </div>
                                        );
                                    }}
                                />
                            )}
                            {selectedIssueObjectType === "Work" && (
                                <FormField
                                    control={form.control}
                                    name="workId"
                                    render={({ field, fieldState }) => {
                                        const { value, ...restFieldProps } =
                                            field;
                                        return (
                                            <div className="pl-4 pb-8">
                                                <FormItem>
                                                    <div className="pb-4">
                                                        <FormLabel htmlFor="workId">
                                                            {(selectedWorkType ||
                                                                "Work") + " *"}
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <WorkSelection
                                                            restFieldProps={
                                                                restFieldProps
                                                            }
                                                            createNewOn={
                                                                props.createNewOn
                                                            }
                                                            inputClassName={`${
                                                                fieldState.error
                                                                    ? "ring-1 ring-red-600"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-600 pt-4 pb-0 mb-0" />
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
                                        <div className={`w-full px-4`}>
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="title">
                                                        Issue Title *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        id="title"
                                                        placeholder="Title of your issue"
                                                        className={`${
                                                            fieldState.error
                                                                ? "ring-1 ring-red-600"
                                                                : ""
                                                        }`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage
                                                    className={`text-red-600`}
                                                />
                                            </FormItem>
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="public"
                                    render={({ field }) => (
                                        <div className="pl-4 pr-8 py-2">
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
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </div>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <div className="px-4 pt-4">
                                        <FormItem>
                                            <div className="pb-1">
                                                <FormLabel htmlFor="description">
                                                    Issue Description
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    id="description"
                                                    placeholder="Description of your issue"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="users"
                                render={({ field }) => {
                                    const { value, ...restFieldProps } = field;
                                    return (
                                        <div className="p-4">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="users">
                                                        Authors *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <UsersSelection
                                                        restFieldProps={
                                                            restFieldProps
                                                        }
                                                        createNewOn={
                                                            props.createNewOn
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </div>
                                    );
                                }}
                            />

                            <div className="flex justify-end mt-16">
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Create Issue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateIssueForm;

export type SelectedIssueInfo = {
    label?: string;
    tableName?: string;
    tableNameForIntermediate?: string;
    intermediateTable?: string;
};

function getIssueTypeInfo(
    issueType: string,
    intermediateTable: string
): SelectedIssueInfo {
    switch (issueType) {
        case "Project":
            return {
                label: "Project",
                tableName: "issues",
                tableNameForIntermediate: "issue",
                intermediateTable: intermediateTable,
            };
        case "Work":
            return {
                label: "Work",
                tableName: "issues",
                tableNameForIntermediate: "issue",
                intermediateTable: intermediateTable,
            };
        case "Submission":
            return {
                label: "Work",
                tableName: "issues",
                tableNameForIntermediate: "issue",
                intermediateTable: intermediateTable,
            };
        default:
            return {};
    }
}
