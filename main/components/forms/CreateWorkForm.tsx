import { ProjectGraph, ProjectVersion } from "@/types/versionControlTypes";
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
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useCreateGeneralManyToManyEntry } from "@/app/hooks/create/useCreateGeneralManyToManyEntry";
import { useCreateGeneralData } from "@/app/hooks/create/useCreateGeneralData";
import { useToast } from "../ui/use-toast";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Work } from "@/types/workTypes";
import { useUsersSelectionContext } from "@/app/contexts/selections/UsersSelectionContext";
import ToasterManager, { Operation } from "./form-elements/ToasterManager";
import { useProjectSelectionContext } from "@/app/contexts/selections/ProjectSelectionContext";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import dynamic from "next/dynamic";
import { workTypes } from "@/utils/navItems.config";
const ProjectSelection = dynamic(() => import("./form-elements/ProjectSelection"));
const UsersSelection = dynamic(() => import("./form-elements/UsersSelection"));

interface CreateWorkFormProps {
    initialWorkType?: string;
    createNewOn?: boolean;
    onCreateNew: () => void;
}

const CreateWorkForm: React.FC<CreateWorkFormProps> = (props) => {
    // States
    const [selectedWorkType, setSelectedWorkType] = useState<string>("");

    // Contexts

    // - Selected Project and users
    const { selectedProjectId, setSelectedProjectId } = useProjectSelectionContext();
    const { selectedUsersIds, setSelectedUsersIds } = useUsersSelectionContext();

    // Handles
    // Handle work type and selection
    const handleSelectChange = (value: any) => {
        form.setValue("workType", value);
        form.trigger("workType");
        setSelectedWorkType(value);
    };

    // Handle project selection and data
    useEffect(() => {
        form.setValue("projectId", selectedProjectId);
        form.trigger("projectId");
    }, [selectedProjectId]);

    // Handle users selection
    useEffect(() => {
        form.setValue("users", selectedUsersIds);
        form.trigger("users");
    }, [selectedUsersIds]);

    // Handle Work creation
    const createWork = useCreateGeneralData<Partial<Work>>();
    const createProjectWork = useCreateGeneralManyToManyEntry();
    const createVersion = useCreateGeneralData<Partial<ProjectVersion>>();
    const createProjectGraph = useCreateGeneralData<Partial<ProjectGraph>>();
    const createWorkUsers = useCreateGeneralManyToManyEntry();
    const { toast } = useToast();

    const handleCreateWork = async (formData: any) => {
        try {
            const { workType, users, projectId, ...workData } = formData;

            // For handling database names
            const { label, tableName, tableNameForIntermediate, intermediateTable } =
                getWorkTypeInfo(workType, "users");

            // For handling operation outcome
            let newWorkId: number | null = null;
            let newProjectWorkId: number | null = null;
            let newWorkUsersIds: (number | null)[] = [];

            // Create work
            const newWork = await createWork.mutateAsync({
                tableName: tableName || "",
                input: {
                    ...workData,
                    // research_score: 0,
                    // h_index: 0,
                    // total_citations_count: 0,
                } as Partial<Work>,
            });

            // Create corresponding objects
            if (newWork.data?.id) {
                newWorkId = newWork.data?.id;

                // Add work to project if needed
                if (projectId !== null && projectId !== undefined && projectId !== "") {
                    const intermediateTableName = "project_" + tableName;

                    const newProjectWork = await createProjectWork.mutateAsync({
                        tableName: `${intermediateTableName}`,
                        firstEntityColumnName: `${tableNameForIntermediate}_id`,
                        firstEntityId: newWorkId,
                        secondEntityColumnName: `project_id`,
                        secondEntityId: projectId,
                    });

                    if (newProjectWork?.data) {
                        newProjectWorkId = newProjectWork?.data?.project_id;
                    }
                } else {
                    newProjectWorkId = 0;
                }

                // Add work users and teams
                for (const userId of users) {
                    const intermediateTableName =
                        (tableNameForIntermediate || "") + "_" + intermediateTable;
                    const newWorkUsers = (await createWorkUsers.mutateAsync({
                        tableName: `${intermediateTableName}`,
                        firstEntityColumnName: `${tableNameForIntermediate}_id`,
                        firstEntityId: newWorkId,
                        secondEntityColumnName: `user_id`,
                        secondEntityId: userId,
                    })) as any;

                    if (newWorkUsers) {
                        newWorkUsersIds.push(newWorkUsers.data?.user_id || null);
                    } else {
                        newWorkUsersIds.push(null);
                    }
                }
            }
            // Handle operation outcome
            const createWorkOperation: Operation = {
                operationType: "create",
                entityType: workType,
                id: newWorkId,
            };
            const createProjectWorkOperation: Operation = {
                operationType: "create",
                entityType: "Work project",
                id: newProjectWorkId,
            };
            const createWorkUsersOperation: Operation[] = newWorkUsersIds.map((userId) => ({
                operationType: "create",
                entityType: "Work users",
                id: userId,
            }));

            toast({
                action: (
                    <ToasterManager
                        operations={[
                            createWorkOperation,
                            createProjectWorkOperation,
                            ...createWorkUsersOperation,
                        ]}
                        mainOperation={createWorkOperation}
                    />
                ),
            });

            props.onCreateNew();
        } catch (error) {
            console.log("An error occurred: ", error);
        }
    };

    // Form
    const CreateWorkSchema = z.object({
        workType: z.string().min(1, { message: "Work Type is required." }),
        projectId: z.string(),
        title: z.string().min(1, { message: "Title is required." }).max(100, {
            message: "Title must be less than 100 characters long.",
        }),
        description: z.string(),
        users: z.array(z.string()).min(1, { message: "At least one user is required." }),
        public: z.boolean(),
    });

    const defaultUsers: string[] = [];

    const form = useForm<z.infer<typeof CreateWorkSchema>>({
        resolver: zodResolver(CreateWorkSchema),
        defaultValues: {
            workType: "",
            projectId: "",
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
                    <CardTitle className="pt-6 pl-4 pb-6">Create Work Form</CardTitle>
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
                        <form onSubmit={form.handleSubmit(handleCreateWork)}>
                            <div className="flex items-start w-full p-4">
                                <FormField
                                    control={form.control}
                                    name="workType"
                                    render={({ field, fieldState }) => (
                                        <div className="w-[370px]">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="workType">
                                                        Work Type *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <Select
                                                            onValueChange={handleSelectChange}
                                                            value={selectedWorkType}
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
                                <FormField
                                    control={form.control}
                                    name="projectId"
                                    render={({ field, fieldState }) => {
                                        const { value, ...restFieldProps } = field;
                                        return (
                                            <div className="pl-4 pt-1 pb-4">
                                                <FormItem>
                                                    <div className="pb-4">
                                                        <FormLabel htmlFor="projectId">
                                                            Project (Optional)
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <ProjectSelection
                                                            restFieldProps={restFieldProps}
                                                            createNewOn={props.createNewOn}
                                                            inputClassName={`${
                                                                fieldState.error
                                                                    ? "ring-1 ring-red-600"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className={`text-red-600`} />
                                                </FormItem>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                            <div className="flex items-start">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field, fieldState }) => (
                                        <div className="w-full pl-4 pr-4">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="title">
                                                        Work Title *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        id="title"
                                                        placeholder="Title of your work"
                                                        className={`${
                                                            fieldState.error
                                                                ? "ring-1 ring-red-600"
                                                                : ""
                                                        }`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-600 pb-0 mb-0" />
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
                                                <div className="pb-1 whitespace-nowrap">
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
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <div className="px-4 pt-4">
                                        <FormItem>
                                            <div className="pb-1">
                                                <FormLabel htmlFor="description">
                                                    Work Description
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    id="description"
                                                    placeholder="Description of your work"
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

                            <div className="flex justify-end mt-16 mr-4">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Create Work
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateWorkForm;

type SelectedWorkInfo = {
    label?: string;
    tableName?: string;
    tableNameForIntermediate?: string;
    intermediateTable?: string;
};

export function getWorkTypeInfo(workType: string, intermediateTable: string): SelectedWorkInfo {
    switch (workType) {
        case "Experiment":
            return {
                label: "Experiment",
                tableName: "experiments",
                tableNameForIntermediate: "experiment",
                intermediateTable: intermediateTable,
            };
        case "Dataset":
            return {
                label: "Dataset",
                tableName: "datasets",
                tableNameForIntermediate: "dataset",
                intermediateTable: intermediateTable,
            };
        case "Data Analysis":
            return {
                label: "Data Analysis",
                tableName: "data_analyses",
                tableNameForIntermediate: "data_analysis",
                intermediateTable: intermediateTable,
            };
        case "AI Model":
            return {
                label: "AI Model",
                tableName: "ai_models",
                tableNameForIntermediate: "ai_model",
                intermediateTable: intermediateTable,
            };
        case "Code Block":
            return {
                label: "Code Block",
                tableName: "code_blocks",
                tableNameForIntermediate: "code_block",
                intermediateTable: intermediateTable,
            };
        case "Paper":
            return {
                label: "Paper",
                tableName: "papers",
                tableNameForIntermediate: "paper",
                intermediateTable: intermediateTable,
            };
        default:
            return {};
    }
}
