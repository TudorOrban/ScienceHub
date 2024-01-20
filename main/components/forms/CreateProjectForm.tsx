import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useCreateGeneralManyToManyEntry } from "@/hooks/create/useCreateGeneralManyToManyEntry";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useCreateGeneralData } from "@/hooks/create/useCreateGeneralData";
import { Switch } from "../ui/switch";
import { useUsersSelectionContext } from "@/contexts/selections/UsersSelectionContext";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { useCheckProjectNameUniqueness } from "@/hooks/utils/useCheckProjectNameUniqueness";
import { useToastsContext } from "@/contexts/general/ToastsContext";
// import {
//     CreateProjectFormData,
//     CreateProjectSchema,
//     handleCreateProject,
// } from "@/submit-handlers/create/handleCreateProject";
import UsersSelection from "./form-elements/UsersSelection";
import { CreateProjectFormData, CreateProjectSchema, handleCreateProject } from "@/submit-handlers/create/handleCreateProjectNew";

interface CreateProjectFormProps {
    createNewOn: boolean;
    onCreateNew: () => void;
}

// TODO: Refactor this to follow CreateSubmissionForm pattern
const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ createNewOn, onCreateNew }) => {
    // Contexts
    // = Selected Users
    const { selectedUsersIds, setSelectedUsersIds } = useUsersSelectionContext();

    // - Toasts
    const { setOperations } = useToastsContext();

    // Handle users selection
    useEffect(() => {
        form.setValue("users", selectedUsersIds);
        form.trigger("users");
    }, [selectedUsersIds]);

    // Form
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

    // Submit
    const onSubmit = async (formData: CreateProjectFormData) => {
        try {
            await handleCreateProject({
                onCreateNew,
                setOperations,
                formData,
            });
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };

    // Checking name uniqueness
    const { setError, clearErrors, watch } = form;
    const projectName = watch("name");

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
        <Card className="w-[800px] h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-300 sticky bg-white top-0 z-50">
                <CardTitle className="py-6 pl-12">Create Project Form</CardTitle>
                <div className="pr-8">
                    <button className="dialog-close-button" onClick={onCreateNew}>
                        <FontAwesomeIcon icon={faXmark} className="small-icon" />
                    </button>
                </div>
            </div>
            <CardContent className="px-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="flex items-start w-full space-x-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-[350px]">
                                        <FormLabel htmlFor="title">Project Title *</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="title"
                                                placeholder="Title of your project"
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
                                name="name"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-[350px]">
                                        <FormLabel htmlFor="name">Project Name *</FormLabel>

                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="Name of your project"
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
                                    <FormItem>
                                        <FormLabel htmlFor="public">
                                            {field.value === false ? "Private" : "Public"}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="mt-2">
                                                <Switch
                                                    id="public"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className={`text-red-600`} />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="description">Project Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="description"
                                            placeholder="Description of your project"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className={`text-red-600`} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="users"
                            render={({ field, fieldState }) => {
                                const { value, ...restFieldProps } = field;
                                return (
                                    <FormItem>
                                        <FormLabel htmlFor="users">Authors</FormLabel>

                                        <FormControl>
                                            <UsersSelection
                                                restFieldProps={restFieldProps}
                                                createNewOn={createNewOn}
                                            />
                                        </FormControl>
                                        <FormMessage className={`text-red-600`} />
                                    </FormItem>
                                );
                            }}
                        />

                        <div className="flex justify-end mt-6">
                            <button type="submit" className="standard-write-button">
                                Create Project
                            </button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default CreateProjectForm;
