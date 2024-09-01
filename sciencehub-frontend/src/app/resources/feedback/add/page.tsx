import CreateFeedbackForm from "@/src/components/cards/resources/CreateFeedbackForm";

export default function AddFeedbackPage () {
    return (
        <div className="p-12 space-y-4">
            <span className="text-3xl font-semibold">Add Feedback</span>
            <CreateFeedbackForm />
        </div>
    )
}