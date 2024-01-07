import ResourcesBox from "@/components/cards/resources/ResourcesBox";
import {
    faCommentDots,
    faEye,
    faHandHoldingDollar,
    faInfo,
    faQuestion,
    faSignsPost,
} from "@fortawesome/free-solid-svg-icons";

export default function Resources() {
    return (
        <div className="p-4 sm:p-12 bg-white">
            <div className="text-3xl font-semibold mb-2">Resources</div>
            <span className="text-xl">Find out more about ScienceHub.</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 pt-12">
                {/* First row */}
                <ResourcesBox
                    label={"Site Mission"}
                    icon={faEye}
                    content={"Learn more about our ethos."}
                    link="/resources/site-mission"
                />
                <ResourcesBox
                    label={"Information"}
                    icon={faInfo}
                    content={
                        "Learn about ScienceHub's features and our reasoning for introducing them."
                    }
                    link="/resources/information"
                />
                <ResourcesBox
                    label={"Site Roadmap"}
                    icon={faSignsPost}
                    content={"Take a look at our vision for the future of the website."}
                    link="/resources/site-roadmap"
                />
                {/* Second row */}
                <ResourcesBox
                    label={"Feedback"}
                    icon={faCommentDots}
                    content={"Share your feedback with us and contribute to improving ScienceHub."}
                    link="/resources/feedback"
                />
                <ResourcesBox
                    label={"Donations"}
                    icon={faHandHoldingDollar}
                    content={
                        "Donate to support either the infrastructure costs of the services provided or to ScienceHub's development team."
                    }
                    link="/resources/donations"
                />
                <ResourcesBox
                    label={"Help & Support"}
                    icon={faQuestion}
                    content={
                        "Request help with anything on the website and receive quick responses."
                    }
                    link="/resources/help-support"
                />
            </div>
        </div>
    );
}
