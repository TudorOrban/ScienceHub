import { PinnedPage } from "@/contexts/sidebar-contexts/SidebarContext";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../../ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { getIconByIconIdentifier } from "@/utils/getIconByIconIdentifier";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { truncateText } from "@/utils/functions";

interface PinnedPagesResultsProps {
    pinnedPages: PinnedPage[];
    setPinnedPages: (pinnedPages: PinnedPage[]) => void;
    selectedPage: PinnedPage;
    setSelectedPage: (selectedPage: PinnedPage) => void;
    inputQuery: string;
    setInputQuery: (inputQuery: string) => void;
}

/**
 * Component for displaying a user's pinned pages and managing pin/unpin
 */
const PinnedPagesResults: React.FC<PinnedPagesResultsProps> = ({
    pinnedPages,
    setPinnedPages,
    selectedPage,
    setSelectedPage,
    inputQuery,
    setInputQuery,
}) => {
    // Contexts
    const currentUserId = useUserId();
    const router = useRouter();
    const supabase = useSupabaseClient();

    // Handle Pin/Unpin Page
    const handlePinPage = async (pinnedPage: PinnedPage) => {
        const isAlreadyPinned = pinnedPages?.map((page) => page.label).includes(pinnedPage.label);

        if (currentUserId && pinnedPages && !isAlreadyPinned) {
            // Update the database
            const { error } = await supabase
                .from("user_settings")
                .update([
                    {
                        pinned_pages: [
                            ...(pinnedPages || []),
                            {
                                label: pinnedPage.label,
                                link: pinnedPage.link,
                                iconIdentifier: pinnedPage.iconIdentifier,
                            } as PinnedPage,
                        ],
                    },
                ])
                .eq("user_id", currentUserId);

            if (error) {
                console.error("Could not pin page: ", error);
            } else {
                setPinnedPages([...pinnedPages, pinnedPage]);
            }
        }
    };

    const handleUnPinPage = async (pinnedPage: PinnedPage) => {
        const isAlreadyPinned = pinnedPages?.map((page) => page.label).includes(pinnedPage.label);

        if (currentUserId && pinnedPages && isAlreadyPinned) {
            // Update the database
            const newPinnedPages = pinnedPages.filter((page) => page.label !== pinnedPage.label);
            const selPage = selectedPage;
            const { error } = await supabase
                .from("user_settings")
                .update([
                    {
                        pinned_pages: newPinnedPages,
                    },
                ])
                .eq("user_id", currentUserId);

            if (error) {
                console.error("Could not pin page: ", error);
            } else {
                setPinnedPages(newPinnedPages);
                setSelectedPage(selPage);
            }
        }
    };

    return (
        <div className="px-1 py-2 space-y-2 shadow-md" style={{ backgroundColor: "var(--sidebar-bg-color)" }}>
            {/* Pinned pages */}
            {pinnedPages?.map((page) => (
                <div
                    key={page.label}
                    className="flex items-center justify-between hover:bg-gray-700 hover:font-semibold"
                >
                    <button
                        className={`flex items-center px-4 py-2 text-gray-200 ${
                            selectedPage.label === page.label ? "font-semibold" : "font-normal"
                        }`}
                        onClick={() => router.push(page.link)}
                    >
                        <FontAwesomeIcon
                            icon={getIconByIconIdentifier(page.iconIdentifier || "faQuestion")}
                            className="small-size pr-1 mr-1"
                        />
                        {truncateText(page.label, 14)}
                    </button>

                    <button
                        onClick={() => handleUnPinPage(page)}
                        className="flex items-center justify-center w-6 h-6 mr-4 rounded-md border border-gray-800"
                    >
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <FontAwesomeIcon
                                        icon={faMapPin}
                                        className="small-icon text-gray-300"
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white p-2 font-semibold">
                                    Pin to Sidebar
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </button>
                </div>
            ))}

            {/* Current page, if not among pinned pages */}
            {!pinnedPages.map((page) => page.label)?.includes(selectedPage.label) && (
                <div
                    key={selectedPage.label}
                    className="flex items-center justify-between pr-5 hover:bg-gray-800 hover:font-semibold"
                >
                    <button
                        className={`flex items-center px-4 py-2 font-bold text-gray-700`}
                        onClick={() => router.push(selectedPage.link)}
                    >
                        <FontAwesomeIcon
                            icon={
                                getIconByIconIdentifier(
                                    selectedPage.iconIdentifier || "faQuestion"
                                ) || faQuestion
                            }
                            className="small-size pr-1 mr-1"
                        />
                        <p>{truncateText(selectedPage.label, 14)}</p>
                    </button>
                    <button onClick={() => handlePinPage(selectedPage)}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <FontAwesomeIcon
                                        icon={faMapPin}
                                        className="small-icon text-gray-300"
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white p-2 font-semibold">
                                    Pin to Sidebar
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PinnedPagesResults;
