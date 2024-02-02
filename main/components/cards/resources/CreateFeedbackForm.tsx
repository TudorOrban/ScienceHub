"use client";

import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { useCreateGeneralData } from "@/hooks/create/useCreateGeneralData";
import { handleCreateFeedback } from "@/submit-handlers/resources/handleCreateFeedback";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const feedbackSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    content: z.string().min(1, "Content is required"),
    public: z.boolean().optional(),
});

export type FeedbackData = z.infer<typeof feedbackSchema>;

/**
 * Form for creating a feedback
 *
 */
const CreateFeedbackForm = () => {
    // States
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tagInput, setTagInput] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);

    // Hooks
    const router = useRouter();
    const createGeneral = useCreateGeneralData();
    const { setOperations } = useToastsContext();
    const currentUserId = useUserId();

    // Form
    const form = useForm<FeedbackData>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            title: "",
            description: "",
            tags: [],
            content: "",
            public: false,
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    const onSubmit = async (formData: FeedbackData) => {
        // Combine form data with the tags state
        const completeFormData = { ...formData, tags };

        try {
            setIsLoading(true);
            await handleCreateFeedback({
                createGeneral: createGeneral,
                setOperations: setOperations,
                router: router,
                formData: completeFormData,
                currentUserId: currentUserId || undefined,
            });
            setIsLoading(false);
        } catch (error) {
            console.error("Error creating feedback: ", error);
        }
    };

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleAddTag = () => {
        if (tagInput) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
                <label htmlFor="title" className="text-sm font-medium">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    {...form.register("title")}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 mt-1"
                />
                {errors.title && <p className="text-red-700 pt-1">{errors.title.message}</p>}
            </div>
            <div className="flex flex-col">
                <label htmlFor="description" className="text-sm font-medium">
                    Description
                </label>
                <textarea
                    id="description"
                    {...form.register("description")}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 mt-1"
                />
            </div>
            <div className="flex flex-col relative">
                <label htmlFor="tags" className="text-sm font-medium">
                    Tags
                </label>
                <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 mt-1 pr-16"
                />
                <button
                    type="button"
                    onClick={handleAddTag}
                    className="absolute right-1 top-1.5 text-sm bg-blue-500 text-white py-1 px-3 rounded"
                >
                    Add Tag
                </button>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-gray-100 border rounded px-2 py-1"
                        >
                            <span className="mr-2">{tag}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(index)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="small-icon text-gray-700 hover:text-red-700"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col">
                <label htmlFor="content" className="text-sm font-medium">
                    Content
                </label>
                <textarea
                    id="content"
                    {...form.register("content")}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 mt-1"
                />
                {errors.content && <p className="text-red-700 pt-1">{errors.content.message}</p>}
            </div>
            <div className="flex items-center">
                <label htmlFor="public" className="text-sm font-medium">
                    Public
                </label>
                <input
                    type="checkbox"
                    id="public"
                    {...form.register("public")}
                    className="border border-gray-300 rounded-md ml-2"
                />
            </div>
            <div className="flex justify-end">
                <button type="submit" className="standard-write-button">
                    Submit
                </button>
            </div>
            {isLoading && (
                <div className="absolute top-40 left-40">
                    <div className="w-6 h-6 border-2 border-gray-900 rounded-full animate-spin"></div>
                </div>
            )}
        </form>
    );
};

export default CreateFeedbackForm;
