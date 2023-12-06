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
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useCreateGeneralManyToManyEntry } from "@/app/hooks/create/useCreateGeneralManyToManyEntry";
import { useCreateGeneralData } from "@/app/hooks/create/useCreateGeneralData";
import { useToast } from "../ui/use-toast";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ToasterManager, { Operation } from "./form-elements/ToasterManager";
import { useProjectSelectionContext } from "@/app/contexts/selections/ProjectSelectionContext";
import { useUsersSelectionContext } from "@/app/contexts/selections/UsersSelectionContext";
import { useWorkSelectionContext } from "@/app/contexts/selections/WorkSelectionContext";
import { workTypes } from "@/utils/navItems.config";
import { Review } from "@/types/managementTypes";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
const ProjectSelection = dynamic(() => import("./form-elements/ProjectSelection"));
const UsersSelection = dynamic(() => import("./form-elements/UsersSelection"));
const WorkSelection = dynamic(() => import("./form-elements/WorkSelection"));

type CreateReviewInput = {
    object_type: string;
    object_id: string;
    title: string;
    description: string;
    public: boolean;
};

type InitialReviewValues = {
    initialReviewType?: string;
    initialReviewObjectType?: string;
    initialProjectId?: string;
    initialWorkType?: string;
    initialWorkId?: string;
    initialSubmissionId?: string;
};

interface CreateReviewFormProps {
    initialValues?: InitialReviewValues;
    createNewOn?: boolean;
    onCreateNew: () => void;
}

const CreateReviewForm: React.FC<CreateReviewFormProps> = (props) => {
    // States
    const [selectedReviewType, setSelectedReviewType] = useState<string>(
        props.initialValues?.initialReviewType || "Community"
    );
    const [selectedReviewObjectType, setSelectedReviewObjectType] = useState<string>(
        props.initialValues?.initialReviewObjectType || "Experiment"
    );

    // Contexts
    // - Supabase client
    const supabase = useSupabaseClient();

    // - Selected Project, Work and Users contexts
    const { selectedProjectId, setSelectedProjectId } = useProjectSelectionContext();
    const { selectedWorkType, setSelectedWorkType, selectedWorkId, setSelectedWorkId } =
        useWorkSelectionContext();
    const { selectedUsersIds, setSelectedUsersIds } = useUsersSelectionContext();

    // Handles
    // - Handle review type, review object type and work type selection
    const reviewTypes = ["Community Review", "Blind Review"];
    const reviewObjectTypes = ["Project", "Work", "Submission"];

    const handleSelectReviewTypeChange = (value: any) => {
        form.setValue("reviewType", value);
        form.trigger("reviewType");
        setSelectedReviewType(value);
    };

    const handleSelectReviewObjectTypeChange = (value: any) => {
        form.setValue("reviewObjectType", value);
        form.trigger("reviewObjectType");
        setSelectedReviewObjectType(value);
    };

    const handleSelectWorkTypeChange = (value: any) => {
        form.setValue("workType", value);
        form.trigger("workType");
        setSelectedWorkType(value);
    };

    // Form sync and validation effects
    useEffect(() => {
        form.setValue("reviewType", selectedReviewType);
        form.trigger("reviewType");
    }, [selectedReviewType]);

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

    // Handle Project creation
    const createReview = useCreateGeneralData<Partial<Review>>();
    const createReviewUsers = useCreateGeneralManyToManyEntry();
    const { toast } = useToast();

    const handleCreateReview = async (formData: z.infer<typeof CreateReviewSchema>) => {
        try {
            const {
                reviewType,
                reviewObjectType,
                projectId,
                workType,
                workId,
                users,
                ...reviewData
            } = formData;
            console.log(formData);

            // For handling database names
            const { label, tableName, tableNameForIntermediate, intermediateTable } =
                getReviewNames(reviewObjectType, "users");

            // For handling operation outcome
            let newReviewId: number | null = null;
            let newReviewUsersIds: (number | null)[] = [];

            let reviewCreationData = {
                review_type: "",
                object_type: "",
                object_id: "",
                title: "",
                description: "",
                public: false,
            };

            if (reviewType === "Community Review") {
                switch (reviewObjectType) {
                    case "Project":
                        if (projectId !== null && projectId !== undefined && projectId !== "") {
                            reviewCreationData = {
                                review_type: reviewType,
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
                            reviewCreationData = {
                                review_type: reviewType,
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
                            reviewCreationData = {
                                review_type: reviewType,
                                object_type: "Submission",
                                object_id: workId,
                                title: formData.title,
                                description: formData.description,
                                public: formData.public,
                            };
                        }
                        break;
                }
            } else if (reviewType === "Blind Review") {
                // TODO: Blind Review mechanism
            } else {
                // TODO: Handle gracefully
            }

            // Create review
            const newReview = await createReview.mutateAsync({
                supabase,
                tableName: "reviews",
                input: {
                    ...reviewCreationData,
                } as Partial<Review>,
            });

            // Create corresponding objects
            if (newReview.id) {
                newReviewId = newReview.id;

                // Add review users and teams
                for (const userId of users) {
                    const intermediateTableName =
                        (tableNameForIntermediate || "") + "_" + intermediateTable;
                    const newReviewUsers = (await createReviewUsers.mutateAsync({
                        supabase,
                        tableName: `${intermediateTableName}`,
                        firstEntityColumnName: `${tableNameForIntermediate}_id`,
                        firstEntityId: newReview.id,
                        secondEntityColumnName: `user_id`,
                        secondEntityId: userId,
                    })) as any;

                    if (newReviewUsers) {
                        newReviewUsersIds.push(newReviewUsers.data?.user_id || null);
                    } else {
                        newReviewUsersIds.push(null);
                    }
                }
            }
            // Handle operation outcome
            const createReviewOperation: Operation = {
                operationType: "create",
                entityType: reviewType,
                id: newReviewId,
            };
            const createReviewUsersOperation: Operation[] = newReviewUsersIds.map((userId) => ({
                operationType: "create",
                entityType: "Review users",
                id: userId,
            }));

            toast({
                action: (
                    <ToasterManager
                        operations={[createReviewOperation, ...createReviewUsersOperation]}
                        mainOperation={createReviewOperation}
                    />
                ),
            });

            form.reset();
            props.onCreateNew();
        } catch (error) {
            console.log("An error occurred: ", error);
        }
    };

    // Zod validation schema
    const CreateReviewSchema = z
        .object({
            reviewType: z.string().min(1, { message: "Review Type is required." }),
            reviewObjectType: z.string().min(1, { message: "Review Object Type is required." }),
            projectId: z.string(),
            workType: z.string(),
            workId: z.string(),
            title: z.string().min(1, { message: "Title is required." }).max(100, {
                message: "Title must be less than 100 characters long.",
            }),
            description: z.string(),
            users: z.array(z.string()).min(1, { message: "At least one user is required." }),
            public: z.boolean(),
        })
        .superRefine((data, ctx) => {
            if (data.reviewType === "Community Review") {
                if (data.reviewObjectType === "Work") {
                    if (!data.workType) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Work Type is required.",
                            path: [...ctx.path, "workType"],
                        });
                    }
                    if (!data.workId) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Work is required.",
                            path: [...ctx.path, "workId"],
                        });
                    }
                }

                if (data.reviewObjectType === "Project" && !data.projectId) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Project is required.",
                        path: [...ctx.path, "projectId"],
                    });
                }
            }
        });

    // Form
    const defaultUsers: string[] = [];

    const form = useForm<z.infer<typeof CreateReviewSchema>>({
        resolver: zodResolver(CreateReviewSchema),
        defaultValues: {
            reviewType: "",
            reviewObjectType: "",
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
                    <CardTitle className="pt-6 pl-4 pb-6">Create Review Form</CardTitle>
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
                        <form onSubmit={form.handleSubmit(handleCreateReview)}>
                            <div>
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
                            </div>
                            <div className="flex items-start w-full px-4 pb-4 pt-2 space-x-4">
                                <FormField
                                    control={form.control}
                                    name="reviewObjectType"
                                    render={({ field, fieldState }) => (
                                        <div className="w-[350px]">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="reviewObjectType">
                                                        Review of *
                                                    </FormLabel>
                                                </div>
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
                                        </div>
                                    )}
                                />
                                {selectedReviewObjectType === "Work" && (
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
                            {selectedReviewType !== "Blind Review" && (
                                <>
                                    {selectedReviewObjectType === "Project" && (
                                        <FormField
                                            control={form.control}
                                            name="projectId"
                                            render={({ field, fieldState }) => {
                                                const { value, ...restFieldProps } = field;
                                                return (
                                                    <div className="pl-4 pt-1 pb-8">
                                                        <FormItem>
                                                            <div className="pb-4">
                                                                <FormLabel htmlFor="projectId">
                                                                    Project *
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
                                                                    initialProjectId={
                                                                        props.initialValues
                                                                            ?.initialProjectId
                                                                    }
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
                                    {selectedReviewObjectType === "Work" && (
                                        <FormField
                                            control={form.control}
                                            name="workId"
                                            render={({ field, fieldState }) => {
                                                const { value, ...restFieldProps } = field;
                                                return (
                                                    <div className="pl-4 pt-1 pb-8">
                                                        <FormItem>
                                                            <div className="pb-4">
                                                                <FormLabel htmlFor="workId">
                                                                    {(selectedWorkType || "Work ") +
                                                                        " *"}
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
                                                            <FormMessage
                                                                className={`text-red-600 pt-4`}
                                                            />
                                                        </FormItem>
                                                    </div>
                                                );
                                            }}
                                        />
                                    )}
                                </>
                            )}

                            <div className="flex items-start">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field, fieldState }) => (
                                        <div className="w-full pl-4 pr-4">
                                            <FormItem>
                                                <div className="pb-1">
                                                    <FormLabel htmlFor="title">
                                                        Review Title *
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        id="title"
                                                        placeholder="Title of your review"
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
                                        <div className="pl-4 pr-8">
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
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <div className="px-4 py-4">
                                        <FormItem>
                                            <div className="pb-1">
                                                <FormLabel htmlFor="description">
                                                    Review Description
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    id="description"
                                                    placeholder="Description of your review"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </div>
                                )}
                            />
                            {selectedReviewType !== "Blind Review" && (
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
                                                            Authors
                                                        </FormLabel>
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
                            )}

                            <div className="flex justify-end mt-16">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Create Review
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateReviewForm;

export type SelectedReviewInfo = {
    label?: string;
    tableName?: string;
    tableNameForIntermediate?: string;
    intermediateTable?: string;
};

function getReviewNames(reviewType: string, intermediateTable: string): SelectedReviewInfo {
    switch (reviewType) {
        case "Project":
            return {
                label: "Project",
                tableName: "reviews",
                tableNameForIntermediate: "review",
                intermediateTable: intermediateTable,
            };
        case "Work":
            return {
                label: "Work",
                tableName: "reviews",
                tableNameForIntermediate: "review",
                intermediateTable: intermediateTable,
            };
        case "Submission":
            return {
                label: "Work",
                tableName: "reviews",
                tableNameForIntermediate: "review",
                intermediateTable: intermediateTable,
            };
        default:
            return {};
    }
}
