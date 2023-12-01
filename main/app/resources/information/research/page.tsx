"use client";

import NavigationMenu from "@/components/headers/NavigationMenu";
import { TextWithLink } from "@/components/light-simple-elements/TextWithLink";
import { useState } from "react";

export default function InformationResearchPage() {
    const [activeTab, setActiveTab] = useState<string>("Projects");

    return (
        <div>
            <div className="py-8 text-2xl font-semibold flex justify-center">
                Research
            </div>
            <NavigationMenu
                items={[{ label: "Projects" }, { label: "Works" }]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200"
            />
            <div className="p-4 mt-4">
                {activeTab === "Projects" && (
                    <div className="">
                        The <b>Project</b> is ScienceHub&apos;s main organizational
                        unit. It behaves as an individual directory, being able
                        to hold Folders, Files, or Scientific{" "}
                        <button
                            className="hover:text-blue-600 hover:underline"
                            onClick={() => setActiveTab("Works")}
                        >
                            Works
                        </button>
                        . It has been designed with the following aims in mind:
                        <ul className="list-disc pl-6 mb-4 space-y-2 mt-2">
                            <li>
                                <strong>Scalability</strong>: to encourage and
                                support long-term scientific goals, the
                                Project&apos;s structure, navigation and
                                functionality is build modularly and prepared
                                for large undertakings.
                            </li>
                            <li>
                                <strong>Flexibility</strong>:
                            </li>
                            <li>
                                <strong>Collaboration</strong>: to encourage and
                                support both teamwork and community building.
                            </li>
                        </ul>
                        <TextWithLink
                            text={"Submissions, Issues, Reviews"}
                            link={"/resources/information/management"}
                        />
                    </div>
                )}
                {activeTab === "Works" && (
                        <div className="">
                            <b>Works</b> are the building blocks through which scientific research is shared on ScienceHub. 
                            {/* <ul className="list-disc pl-6 mb-4 space-y-2 mt-2">
                                <li>
                                    <strong>Scalability</strong>: to encourage
                                    and support long-term scientific goals, the
                                    Project's structure, navigation and
                                    functionality is build modularly and
                                    prepared for large undertakings.
                                </li>
                                <li>
                                    <strong>Flexibility</strong>:
                                </li>
                                <li>
                                    <strong>Collaboration</strong>: to encourage
                                    and support both teamwork and community
                                    building.
                                </li>
                            </ul> */}
                            {/* <TextWithLink
                                text={"Submissions, Issues, Reviews"}
                                link={"/resources/information/management"}
                            /> */}
                    </div>
                )}
            </div>
        </div>
    );
}
