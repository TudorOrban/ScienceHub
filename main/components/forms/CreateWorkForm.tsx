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
import { useCreateGeneralManyToManyEntry } from "@/hooks/create/useCreateGeneralManyToManyEntry";
import { useCreateGeneralData } from "@/hooks/create/useCreateGeneralData";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useUsersSelectionContext } from "@/contexts/selections/UsersSelectionContext";
import { useProjectSelectionContext } from "@/contexts/selections/ProjectSelectionContext";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateWorkFormData, handleCreateWork } from "@/submit-handlers/create/handleCreateWork";
import dynamic from "next/dynamic";
import { workTypes } from "@/config/navItems.config";
import { CreateWorkSchema } from "@/submit-handlers/create/handleCreateWork";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { useProjectSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
const ProjectSelection = dynamic(() => import("./form-elements/ProjectSelection"));
const UsersSelection = dynamic(() => import("./form-elements/UsersSelection"));

interface CreateWorkFormProps {
    initialWorkType?: string;
    initialProjectId?: string;
    initialProjectSubmissionId?: string;
    createNewOn?: boolean;
    onCreateNew: () => void;
}

const CreateWorkForm: React.FC<CreateWorkFormProps> = ({
    initialWorkType,
    initialProjectId,
    initialProjectSubmissionId,
    createNewOn,
    onCreateNew
}) => {
    // States
    const [selectedWorkType, setSelectedWorkType] = useState<string>(initialWorkType || "");
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(initialProjectSubmissionId || "");

    // Contexts
    // - Selected Project and users
    const { selectedProjectId, setSelectedProjectId } = useProjectSelectionContext();
    const { selectedUsersIds, setSelectedUsersIds } = useUsersSelectionContext();

    // - Toasts
    const { setOperations } = useToastsContext();

    // Handles
    // Handle work type and selection
    const handleSelectWorkTypeChange = (value: string) => {
        form.setValue("workType", value);
        form.trigger("workType");
        setSelectedWorkType(value);
    };

    const handleSelectSubmissionChange = (value: string) => {
        form.setValue("submissionId", value);
        form.trigger("submissionId");
        setSelectedSubmissionId(value);
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

    // Fetch project submissions if necessary
    const projectSubmissions = useProjectSubmissionsSearch({
        extraFilters: {
            project_id: selectedProjectId,
        },
        enabled: !!selectedProjectId,
        context: "Reusable",
    });

    // Handle form submission
    const createGeneral = useCreateGeneralData();
    const createGeneralManyToMany = useCreateGeneralManyToManyEntry();
    const updateGeneral = useUpdateGeneralData();

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

    const onSubmit = async (formData: CreateWorkFormData) => {
        try {
            await handleCreateWork({
                createGeneral,
                createGeneralManyToMany,
                updateGeneral,
                onCreateNew: onCreateNew,
                setOperations: setOperations,
                formData,
            });
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };

    return (
        <Card className="w-[800px] h-[500px] overflow-y-auto rounded-md border border-gray-300">
            <div className="flex justify-between border-b border-gray-300 sticky bg-white top-0 z-80">
                <CardTitle className="py-6 pl-12">Create Work Form</CardTitle>
                <div className="pt-4 pr-10">
                    <Button
                        className="bg-gray-50 border border-gray-300 text-gray-800 flex justify-center w-10 h-10 hover:bg-red-700"
                        onClick={onCreateNew}
                    >
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
                                name="workType"
                                render={({ field, fieldState }) => (
                                        <FormItem className="w-80">
                                            <FormLabel htmlFor="workType" className="pb-1">
                                                Work Type *
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <Select
                                                        onValueChange={handleSelectWorkTypeChange}
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
                                                </div>
                                            </FormControl>
                                            <FormMessage className={`text-red-600`} />
                                        </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field, fieldState }) => {
                                    const { value, ...restFieldProps } = field;
                                    return (
                                            <FormItem>
                                                <FormLabel htmlFor="projectId" className="pb-1">
                                                    Project (Optional)
                                                </FormLabel>
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
                        </div>
                        {selectedProjectId && (
                            <FormField
                                control={form.control}
                                name="submissionId"
                                render={({ field, fieldState }) => (
                                    <div className="pt-1 pb-4">
                                        <FormItem>
                                            <FormLabel htmlFor="submissionId">
                                                Project Submission *
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={handleSelectSubmissionChange}
                                                    value={selectedSubmissionId}
                                                >
                                                    <SelectTrigger
                                                        id="submissionId"
                                                        className={`${
                                                            fieldState.error
                                                                ? "ring-1 ring-red-600"
                                                                : ""
                                                        }`}
                                                    >
                                                        <SelectValue
                                                            placeholder="Select Project Submission"
                                                            {...field}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        position="popper"
                                                        className="max-h-[200px] overflow-y-auto"
                                                    >
                                                        {projectSubmissions.data.map(
                                                            (submission, index) => (
                                                                <SelectItem
                                                                    key={submission.id}
                                                                    value={submission.id.toString()}
                                                                >
                                                                    {submission.title}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className={`text-red-600`} />
                                        </FormItem>
                                    </div>
                                )}
                            />
                        )}
                        <div className="flex items-start">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field, fieldState }) => (
                                    <div className="w-full">
                                        <FormItem>
                                            <FormLabel htmlFor="title" className="pb-1">
                                                Work Title *
                                            </FormLabel>
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
                                    <div className="px-4 py-2">
                                        <FormItem>
                                            <FormLabel htmlFor="public" className="pb-1">
                                                {field.value === false ? "Private" : "Public"}
                                            </FormLabel>
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
                                <div className="pt-4">
                                    <FormItem>
                                        <FormLabel htmlFor="description" className="pb-1">
                                            Work Description
                                        </FormLabel>
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
                                    <div className="py-4">
                                        <FormItem>
                                            <FormLabel htmlFor="users" className="pb-1">
                                                Authors
                                            </FormLabel>
                                            <FormControl>
                                                <UsersSelection
                                                    restFieldProps={restFieldProps}
                                                    createNewOn={createNewOn}
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
    );
};

export default CreateWorkForm;
