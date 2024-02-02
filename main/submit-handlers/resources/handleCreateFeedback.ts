import { FeedbackData } from "@/components/cards/resources/CreateFeedbackForm";
import { Operation } from "@/contexts/general/ToastsContext";
import { GeneralCreateInput, GeneralCreateOutput } from "@/services/create/createGeneralData";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Function handling the creation of a feedback for Resources pages.
 * To be moved to the backend soon.
 */
interface HandleCreateFeedbackParams {
    createGeneral: UseMutationResult<
        GeneralCreateOutput,
        PostgrestError,
        Omit<GeneralCreateInput<unknown>, "supabase">,
        unknown
    >;
    setOperations: (operations: Operation[]) => void;
    router: AppRouterInstance;
    formData: FeedbackData;
    currentUserId: string | undefined;
}

export const handleCreateFeedback = async ({
    createGeneral,
    setOperations,
    router,
    formData,
    currentUserId,
}: HandleCreateFeedbackParams) => {
    if (!currentUserId) {
        setOperations([
            {
                operationType: "update",
                operationOutcome: "error",
                entityType: "Feedback",
                customMessage: `An error occurred while creating the feedback: no user logged in.`,
            },
        ]);
        return;
    }
    const newFeedback = await createGeneral.mutateAsync({
        tableName: "feedbacks",
        input: {
            title: formData.title,
            user_id: currentUserId,
            description: formData.description,
            content: formData.content,
            tags: formData.tags,
            public: formData.public,
        },
    });

    if (createGeneral.error || newFeedback.error || !newFeedback.data) {
        console.error(
            `An error occurred while creating the feedback`,
            createGeneral.error || newFeedback.error
        );

        setOperations([
            {
                operationType: "update",
                operationOutcome: "error",
                entityType: "Work",
                customMessage: `An error occurred while creating the feedback.`,
            },
        ]);

        return;
    } else {
        setOperations([
            {
                operationType: "update",
                operationOutcome: "success",
                entityType: "Work",
                customMessage: `Feedback created successfully.`,
            },
        ]);

        router.push(`/resources/feedback/${newFeedback.data.id}`);
    }
}