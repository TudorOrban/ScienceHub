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
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useProjectSelectionContext } from "@/contexts/selections/ProjectSelectionContext";
import { useUsersSelectionContext } from "@/contexts/selections/UsersSelectionContext";
import { useWorkSelectionContext } from "@/contexts/selections/WorkSelectionContext";
import { workTypes } from "@/config/navItems.config";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import UsersSelection from "./form-elements/UsersSelection";
import {
    CreateReviewFormData,
    CreateReviewSchema,
    handleCreateReview,
} from "@/submit-handlers/create/handleCreateReview";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import LoadingSpinner from "../elements/LoadingSpinner";
const ProjectSelection = dynamic(() => import("./form-elements/ProjectSelection"));
const WorkSelection = dynamic(() => import("./form-elements/WorkSelection"));

type InitialReviewValues = {
    initialReviewType?: string;
    initialReviewObjectType?: string;
    initialProjectId?: number;
    initialWorkType?: string;
    initialWorkId?: number;
};

interface CreateReviewFormProps {
    initialValues?: InitialReviewValues;
    createNewOn?: boolean;
    onCreateNew: () => void;
}

/**
 * Form for creating a project/work review. To be refactored.
 */
const CreateReviewForm: React.FC<CreateReviewFormProps> = ({
    initialValues,
    createNewOn,
    onCreateNew,
}) => {
    // States
    // TODO: Later add "Blind Review" back in
    // const [selectedReviewType, setSelectedReviewType] = useState<string>(
    //     initialValues?.initialReviewType || "Community"
    // );
    const [selectedReviewObjectType, setSelectedReviewObjectType] = useState<string>(
        initialValues?.initialReviewObjectType || "Project"
    );

    const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

    // Contexts
    const { setOperations } = useToastsContext();
    // Selected Project, Work and Users contexts
    const { selectedProjectId, setSelectedProjectId } = useProjectSelectionContext();
    const { selectedWorkType, setSelectedWorkType, selectedWorkId, setSelectedWorkId } =
        useWorkSelectionContext();
    const { selectedUsersIds, setSelectedUsersIds } = useUsersSelectionContext();

    // Handles
    // - Handle review type, review object type and work type selection
    // const reviewTypes = ["Community Review", "Blind Review"];
    const reviewObjectTypes = ["Project", "Work"];

    // const handleSelectReviewTypeChange = (value: any) => {
    //     form.setValue("reviewType", value);
    //     form.trigger("reviewType");
    //     setSelectedReviewType(value);
    // };

    const handleSelectReviewObjectTypeChange = (value: string) => {
        form.setValue("reviewObjectType", value);
        form.trigger("reviewObjectType");
        setSelectedReviewObjectType(value);
    };

    const handleSelectWorkTypeChange = (value: string) => {
        form.setValue("workType", value);
        form.trigger("workType");
        setSelectedWorkType(value);
    };

    // Form sync and validation effects
    // useEffect(() => {
    //     form.setValue("reviewType", selectedReviewType);
    //     form.trigger("reviewType");
    // }, [selectedReviewType]);

    useEffect(() => {
        form.setValue("reviewObjectType", selectedReviewObjectType);
        form.trigger("reviewObjectType");
    }, [selectedReviewObjectType]);

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
        form.setValue("users", selectedUsersIds);
        form.trigger("users");
    }, [selectedUsersIds]);

    // Form
    const form = useForm<z.infer<typeof CreateReviewSchema>>({
        resolver: zodResolver(CreateReviewSchema),
        defaultValues: {
            // reviewType: "",
            reviewObjectType: "",
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
    const onSubmit = async (formData: CreateReviewFormData) => {
        try {
            await handleCreateReview({
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
                <CardTitle className="py-6 pl-12">Create Review Form</CardTitle>
                <div className="pr-8">
                    <button className="dialog-close-button" onClick={onCreateNew}>
                        <FontAwesomeIcon icon={faXmark} className="small-icon" />
                    </button>
                </div>
            </div>
            <CardContent className="px-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        {/* <div>
                                <FormField
                                    control={form.control}
                                    name="reviewType"
                                    render={({ field, fieldState }) => (
                                        <div className="w-full px-4 pt-6 pb-2">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="reviewType">
                                                        Review Type *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <Select
                                                            onValueChange={
                                                                handleSelectReviewTypeChange
                                                            }
                                                            value={selectedReviewType}
                                                        >
                                                            <SelectTrigger
                                                                id="reviewType"
                                                                className={`${
                                                                    fieldState.error
                                                                        ? "ring-1 ring-red-600"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <SelectValue
                                                                    placeholder="Select Review Type"
                                                                    {...field}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent
                                                                position="popper"
                                                                className="max-h-[200px] overflow-y-auto"
                                                            >
                                                                {reviewTypes.map(
                                                                    (reviewType, index) => (
                                                                        <SelectItem
                                                                            key={index}
                                                                            value={reviewType}
                                                                        >
                                                                            {reviewType}
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
                            </div> */}
                        <div className="flex items-start w-full space-x-4">
                            <FormField
                                control={form.control}
                                name="reviewObjectType"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-[350px]">
                                        <FormLabel htmlFor="reviewObjectType">
                                            Review of *
                                        </FormLabel>

                                        <FormControl>
                                            <div className="flex items-center">
                                                <Select
                                                    onValueChange={
                                                        handleSelectReviewObjectTypeChange
                                                    }
                                                    value={selectedReviewObjectType}
                                                    required
                                                >
                                                    <SelectTrigger
                                                        id="reviewObjectType"
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
                                                        {reviewObjectTypes.map(
                                                            (reviewObjectType, index) => (
                                                                <SelectItem
                                                                    key={index}
                                                                    value={reviewObjectType}
                                                                >
                                                                    {reviewObjectType}
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
                            {selectedReviewObjectType === "Work" && (
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
                                                </div>
                                            </FormControl>
                                            <FormMessage className={`text-red-600`} />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        {selectedReviewObjectType === "Project" && (
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
                                                        initialValues?.initialProjectId
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage className={`text-red-600`} />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}
                        {selectedReviewObjectType === "Work" && (
                            <FormField
                                control={form.control}
                                name="workId"
                                render={({ field, fieldState }) => {
                                    const { value, ...restFieldProps } = field;
                                    return (
                                        <FormItem>
                                            <FormLabel htmlFor="workId">
                                                {(selectedWorkType || "Work ") + " *"}
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

                        <div className="flex items-start justify-between w-full space-x-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full">
                                        <FormLabel htmlFor="title">Review Title *</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="title"
                                                placeholder="Title of your review"
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
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="description">Review Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="description"
                                            placeholder="Description of your review"
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
                                Create Review
                            </button>
                        </div>
                    </form>
                </Form>
            </CardContent>
            {isCreateLoading && <LoadingSpinner />}
        </Card>
    );
};

export default CreateReviewForm;
