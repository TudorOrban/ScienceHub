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
import { useContext, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useCreateGeneralManyToManyEntry } from "@/hooks/create/useCreateGeneralManyToManyEntry";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useCreateGeneralData } from "@/hooks/create/useCreateGeneralData";
import { ProjectLayout } from "@/types/projectTypes";
import { useToast } from "../ui/use-toast";
import { Switch } from "../ui/switch";
import { useUsersSelectionContext } from "@/contexts/selections/UsersSelectionContext";
import ToasterManager, { Operation } from "./form-elements/ToasterManager";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import dynamic from "next/dynamic";
import { useCheckProjectNameUniqueness } from "@/hooks/utils/useCheckProjectNameUniqueness";
const UsersSelection = dynamic(() => import("./form-elements/UsersSelection"));

interface CreateProjectFormProps {
    createNewOn: boolean;
    onCreateNew: () => void;
}

// TODO: Refactor this to follow CreateSubmissionForm pattern
const CreateProjectForm: React.FC<CreateProjectFormProps> = (props) => {
    // Contexts
    // = Selected Users
    const { selectedUsersIds, setSelectedUsersIds } = useUsersSelectionContext();

    // Handle users selection
    useEffect(() => {
        form.setValue("users", selectedUsersIds);
        form.trigger("users");
    }, [selectedUsersIds]);

    // Handle Project creation
    const createProject = useCreateGeneralData<Partial<ProjectLayout>>();
    const createVersion = useCreateGeneralData<Partial<ProjectVersion>>();
    const createProjectGraph = useCreateGeneralData<Partial<ProjectGraph>>();
    const updateProject = useUpdateGeneralData<ProjectLayout>();
    const createProjectUsers = useCreateGeneralManyToManyEntry();
    const { toast } = useToast();

    const handleCreateProject = async (formData: z.infer<typeof CreateProjectSchema>) => {
        try {
            const { users, ...projectData } = formData;

            // Variables for operation outcome
            let newProjectId,
                newVersionId,
                newProjectGraphId: number | null = null;
            let newProjectUsersIds: (number | null)[] = [];
            
            const newProject = await createProject.mutateAsync({
                tableName: "projects",
                input: {
                    ...projectData,
                    research_score: 0,
                    h_index: 0,
                    total_project_citations_count: 0,
                } as Partial<ProjectLayout>,
            });

            // Create corresponding objects
            if (newProject.data?.id) {
                newProjectId = newProject.data?.id;

                // Generate new project version
                const newVersion = await createVersion.mutateAsync({
                    tableName: "project_versions",
                    input: {
                        project_id: newProjectId,
                    } as Partial<ProjectVersion>,
                });
                if (newVersion.data?.id) {
                    newVersionId = newVersion.data?.id;

                    // Generate project version graph
                    const newProjectGraph = await createProjectGraph.mutateAsync({
                        tableName: "project_versions_graphs",
                        input: {
                            project_id: newProject.data?.id,
                            graph_data: {
                                [newVersionId]: {
                                    neighbors: [],
                                    isSnapshot: true,
                                },
                            },
                        } as Partial<ProjectGraph>,
                    });

                    if (newProjectGraph.data?.id) {
                        newProjectGraphId = Number(newProjectGraph.data?.id);
                    }
                }
                // Add project users and teams
                for (const userId of users) {
                    const newProjectUsers = (await createProjectUsers.mutateAsync({
                        tableName: "project_users",
                        firstEntityColumnName: "project_id",
                        firstEntityId: newProject.data?.id,
                        secondEntityColumnName: "user_id",
                        secondEntityId: userId,
                    }));

                    if (newProjectUsers) {
                        newProjectUsersIds.push(newProjectUsers.data?.user_id || null);
                    } else {
                        newProjectUsersIds.push(null);
                    }
                }
            }
            // Handle operation outcome
            const createProjectOperation: Operation = {
                operationType: "create",
                entityType: "Project",
                id: newProjectId,
            };
            const createProjectVersionOperation: Operation = {
                operationType: "create",
                entityType: "Project version",
                id: newVersionId,
            };
            const createProjectGraphOperation: Operation = {
                operationType: "create",
                entityType: "Project graph",
                id: newProjectGraphId,
            };
            const createProjectUsersOperation: Operation[] = newProjectUsersIds.map((userId) => ({
                operationType: "create",
                entityType: "Project users",
                id: userId,
            }));

            toast({
                action: (
                    <ToasterManager
                        operations={[
                            createProjectOperation,
                            createProjectVersionOperation,
                            createProjectGraphOperation,
                            ...createProjectUsersOperation,
                        ]}
                        mainOperation={createProjectOperation}
                    />
                ),
            });

            props.onCreateNew();
        } catch (error) {
            console.log("An error occured: ", error);
        }
    };

    // Form
    const CreateProjectSchema = z.object({
        title: z.string().min(1, { message: "Title is required." }).max(100, {
            message: "Title must be less than 100 characters long.",
        }),
        name: z.string().min(1, { message: "Name is required." }).max(100, {
            message: "Name must be less than 100 characters long.",
        }),
        description: z.string(),
        users: z.array(z.string()).min(1, { message: "At least one user is required." }),
        public: z.boolean(),
    });

    const defaultUsers: string[] = [];

    const form = useForm<z.infer<typeof CreateProjectSchema>>({
        resolver: zodResolver(CreateProjectSchema),
        defaultValues: {
            title: "",
            name: "",
            description: "",
            users: defaultUsers,
            // teams: [],
            public: false,
        },
    });

    // Checking name uniqueness
    const { setError, clearErrors, watch } = form;
    const projectName = watch("name"); // watch

    // Memoize the debounce function so that it is not recreated on every render
    const checkNameUnique = useMemo(
        () =>
            debounce((isUnique: boolean) => {
                if (!isUnique) {
                    setError("name", {
                        type: "manual",
                        message: "Project Name must be unique.",
                    });
                } else {
                    clearErrors("name");
                }
            }, 300),
        [setError, clearErrors]
    );

    const isUnique = useCheckProjectNameUniqueness(projectName, !!projectName);

    useEffect(() => {
        if (projectName) {
            checkNameUnique(isUnique);
        }
    }, [projectName, isUnique]);

    return (
        <div>
            <Card className="w-[800px] h-[500px] overflow-y-auto">
                <div className="flex justify-between border-b border-gray-300 sticky bg-white top-0 z-80">
                    <CardTitle className="pt-6 pl-4 pb-6">Create Project Form</CardTitle>
                    <div className="pt-4 pr-2">
                        <Button
                            className="dialog-close-butto"
                            onClick={props.onCreateNew}
                        >
                            <FontAwesomeIcon icon={faXmark} className="small-icon" />
                        </Button>
                    </div>
                </div>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreateProject)}>
                            <div className="flex items-start pl-4 pt-4 w-full">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field, fieldState }) => (
                                        <div className="w-[348px] pr-4">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="title">
                                                        Project Title *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        id="title"
                                                        placeholder="Title of your project"
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
                                    name="name"
                                    render={({ field, fieldState }) => (
                                        <div className="w-[360px] pl-4">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="name">
                                                        Project Name *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        id="name"
                                                        placeholder="Name of your project"
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
                                        <div className="px-4 ">
                                            <FormItem>
                                                <div className="whitespace-nowrap pb-2">
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
                                                <FormMessage className={`text-red-600`} />
                                            </FormItem>
                                        </div>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <div className="px-4 pt-2">
                                        <FormItem>
                                            <div className="pb-1">
                                                <FormLabel htmlFor="description">
                                                    Project Description
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    id="description"
                                                    placeholder="Description of your project"
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
                                name="users"
                                render={({ field, fieldState }) => {
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
                                                <FormMessage className={`text-red-600`} />
                                            </FormItem>
                                        </div>
                                    );
                                }}
                            />

                            <div className="flex justify-end mt-16">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Create Project
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateProjectForm;
