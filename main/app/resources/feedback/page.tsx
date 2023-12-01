import { TextWithLink } from "@/components/light-simple-elements/TextWithLink";

export default function FeedbackPage() {
    return (
        <div className="p-4 bg-white">
            <div className="flex justify-center font-semibold text-3xl py-4">
                Feedback
            </div>
            <div className="text-lg p-4">
                As stated in the{" "}
                <TextWithLink text={"Site Mission"} link={"/resources/site-mission"}/>
                , we aim for community-driven development. As such, we provide
                an extensive feedback system. 
            </div>
        </div>
    );
}
