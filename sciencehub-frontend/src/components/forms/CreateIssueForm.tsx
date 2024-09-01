import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/ui/form";
import { Card, CardContent, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useUsersSelectionContext } from "@/src/contexts/selections/UsersSelectionContext";
import { useProjectSelectionContext } from "@/src/contexts/selections/ProjectSelectionContext";
import { useWorkSelectionContext } from "@/src/contexts/selections/WorkSelectionContext";
import { workTypes } from "@/src/config/navItems.config";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import UsersSelection from "./form-elements/UsersSelection";
import dynamic from "next/dynamic";
import {
    CreateIssueFormData,
    CreateIssueSchema,
    handleCreateIssue,
} from "@/src/services/submit-handlers/create/handleCreateIssue";
import { useToastsContext } from "@/src/contexts/general/ToastsContext";
import LoadingSpinner from "../elements/LoadingSpinner";
const ProjectSelection = dynamic(() => import("./form-elements/ProjectSelection"));
const WorkSelection = dynamic(() => import("./form-elements/WorkSelection"));

type InitialIssueValues = {
    initialIssueObjectType?: string;
    initialProjectId?: number;
    initialWorkType?: string;
    initialWorkId?: number;
};

interface CreateIssueFormProps {
    initialValues: InitialIssueValues;
    createNewOn?: boolean;
    onCreateNew: () => void;
}

/**
 * Form for creating a project/work issue. To be refactored.
 */
const CreateIssueForm: React.FC<CreateIssueFormProps> = ({
    initialValues,
    createNewOn,
    onCreateNew,
}) => {
    // States
    const [selectedIssueObjectType, setSelectedIssueObjectType] = useState<string>(
        initialValues.initialIssueObjectType || ""
    );

    const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

    // Contexts
    // Selected Project, Work and Users
    const { selectedProjectId, setSelectedProjectId } = useProjectSelectionContext();
    const { selectedWorkType, setSelectedWorkType, selectedWorkId, setSelectedWorkId } =
        useWorkSelectionContext();
    const { selectedUsersIds, setSelectedUsersIds } = useUsersSelectionContext();
    // Toasts
    const { setOperations } = useToastsContext();

    // Handles
    // Handle issue type and selection
    const issueObjectTypes = ["Project", "Work"];

    const handleSelectIssueObjectTypeChange = (value: string) => {
        form.setValue("issueObjectType", value);
        form.trigger("issueObjectType");
        setSelectedIssueObjectType(value);
    };

    const handleSelectWorkTypeChange = (value: string) => {
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

    // Form
    const form = useForm<z.infer<typeof CreateIssueSchema>>({
        resolver: zodResolver(CreateIssueSchema),
        defaultValues: {
            issueObjectType: "",
            projectId: 0,
            workType: "",
            workId: 0,
            title: "",
            description: "",
            users: [],
            // teams: [],
            public: false,
        },
    });

    // Submit
    const onSubmit = async (formData: CreateIssueFormData) => {
        try {
            await handleCreateIssue({
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
                <CardTitle className="py-6 pl-12">Create Issue Form</CardTitle>
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
                                name="issueObjectType"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-[350px]">
                                        <FormLabel htmlFor="issueObjectType">Issue for *</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <Select
                                                    onValueChange={
                                                        handleSelectIssueObjectTypeChange
                                                    }
                                                    value={selectedIssueObjectType}
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
                                                            (issueObjectType, index) => (
                                                                <SelectItem
                                                                    key={index}
                                                                    value={issueObjectType}
                                                                >
                                                                    {issueObjectType}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </FormControl>
                                        <FormMessage className={`text-red-600`} />
                                    </FormItem>
                                )}
                            />
                            {selectedIssueObjectType === "Work" && (
                                <FormField
                                    control={form.control}
                                    name="workType"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="w-[350px]">
                                            <FormLabel htmlFor="workType">Work Type *</FormLabel>
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
                            )}
                        </div>
                        {selectedIssueObjectType === "Project" && (
                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field, fieldState }) => {
                                    const { value, ...restFieldProps } = field;
                                    return (
                                        <FormItem>
                                            <FormLabel htmlFor="projectId">Project *</FormLabel>
                                            <FormControl>
                                                <ProjectSelection
                                                    restFieldProps={restFieldProps}
                                                    createNewOn={createNewOn}
                                                    inputClassName={`${
                                                        fieldState.error
                                                            ? "ring-1 ring-red-600"
                                                            : ""
                                                    }`}
                                                    initialProjectId={
                                                        initialValues.initialProjectId
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage className={`text-red-600 pt-4`} />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}
                        {selectedIssueObjectType === "Work" && (
                            <FormField
                                control={form.control}
                                name="workId"
                                render={({ field, fieldState }) => {
                                    const { value, ...restFieldProps } = field;
                                    return (
                                        <FormItem>
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
                                            <FormMessage className="text-red-600" />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}
                        <div className="flex items-start justify-between space-x-4 w-full">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full">
                                        <FormLabel htmlFor="title">Issue Title *</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="title"
                                                placeholder="Title of your issue"
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
                                    <FormItem className="inline-block space-y-2">
                                        <FormLabel htmlFor="public">
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
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="description">Issue Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="description"
                                            placeholder="Description of your issue"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="users"
                            render={({ field }) => {
                                const { value, ...restFieldProps } = field;
                                return (
                                    <FormItem>
                                        <FormLabel htmlFor="users">Authors *</FormLabel>
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
                                Create Issue
                            </button>
                        </div>
                    </form>
                </Form>
            </CardContent>
            {isCreateLoading && <LoadingSpinner />}
        </Card>
    );
};

export default CreateIssueForm;
