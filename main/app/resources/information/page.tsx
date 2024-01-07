import { TextWithLink } from "@/components/light-simple-elements/TextWithLink";

export default function InformationPage() {
    return (
        <div className="p-4 sm:p-12">
            <div className="text-3xl font-semibold mb-2">Information</div>
            <p className="">
                These pages document ScienceHub's features, along with the motivations behind them.
                For the technical details of the website, please visit the{" "}
                <TextWithLink text="Contributing page" link="/resources/contributing" />. There are
                three main categories of features:
            </p>
            <ul className="list-disc m-4 space-y-2">
                <li>
                    <TextWithLink
                        text="Research:"
                        link="/resources/information/research"
                        className="text-lg font-semibold text-gray-900"
                    />{" "}
                    concerns the content of scientific research, in the form of either{" "}
                    <strong>Projects</strong> or several types of individual <strong>Works</strong>.
                </li>

                <li>
                    <TextWithLink
                        text="Management:"
                        link="/resources/information/management"
                        className="text-lg font-semibold text-gray-900"
                    />{" "}
                    allows versioning of Projects and Works through <strong>Submissions</strong>,
                    raising of <strong>Issues</strong> and submission of <strong>Reviews</strong>.
                </li>
                <li>
                    <TextWithLink
                        text="Community"
                        link="/resources/information/community"
                        className="text-lg font-semibold text-gray-900"
                    />{" "}
                    provides services for engagement with the community, through{" "}
                    <strong>Discussions</strong>, <strong>Chats</strong> and <strong>Teams</strong>.
                </li>
            </ul>
            An additional important feature is <TextWithLink
                    text="Metrics."
                    link="/resources/information/metrics"
                    className="text-lg font-semibold text-gray-900"
                />
            <div>
                There are 4 main page directories:
                <ul className="list-disc m-4 space-y-2">
                <li>
                    <TextWithLink
                        text="Workspace:"
                        link="/workspace"
                        className="text-lg font-semibold text-gray-900"
                    />{" "}
                    the space dedicated to the user, where they can manage their Research, Management and Community features.
                </li>

                <li>
                    <TextWithLink
                        text="Browse:"
                        link="/browse"
                        className="text-lg font-semibold text-gray-900"
                    />{" "}
                    the space dedicated to exploring ScienceHub's content.
                </li>
                <li>
                    <TextWithLink
                        text="Resources:"
                        link="/resources"
                        className="text-lg font-semibold text-gray-900"
                    />{" "}
                    the space dedicated to providing support for the user. 
                </li>
                <li>
                    <TextWithLink
                        text="User(s) page:"
                        className="text-lg font-semibold text-gray-900"
                    />{" "}
                    the space dedicated to gathering all the user(s)'s projects, works etc.
                </li>
            </ul>
            </div>
        </div>
    );
}
