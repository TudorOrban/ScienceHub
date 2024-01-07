import { PinnedPage } from "@/contexts/sidebar-contexts/SidebarContext";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../../ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { getIconByIconIdentifier } from "@/utils/getIconByIconIdentifier";
import { usePathname, useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUserId } from "@/contexts/current-user/UserIdContext";

interface PinnedPagesResultsProps {
    pinnedPages: PinnedPage[];
    setPinnedPages: (pinnedPages: PinnedPage[]) => void;
    selectedPage: PinnedPage;
    setSelectedPage: (selectedPage: PinnedPage) => void;
    inputQuery: string;
    setInputQuery: (inputQuery: string) => void;
}

const PinnedPagesResults: React.FC<PinnedPagesResultsProps> = ({
    pinnedPages,
    setPinnedPages,
    selectedPage,
    setSelectedPage,
    inputQuery,
    setInputQuery
}) => {
    // Contexts
    // - Current user
    const currentUserId = useUserId();
    
    // - Utils
    const router = useRouter();
    const pathname = usePathname();
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
        <div className="py-1 shadow-md space-y-1">
            {pinnedPages?.map((page) => (
                <div key={page.label} className="flex items-center justify-between hover:bg-gray-100 hover:font-semibold">
                    <button
                        className={`flex items-center px-4 py-2 text-gray-700 ${
                            selectedPage.label === page.label ? "font-bold" : "font-semibold"
                        }`}
                        onClick={() => router.push(page.link)}
                    >
                        <FontAwesomeIcon
                            icon={getIconByIconIdentifier(page.iconIdentifier || "faQuestion")}
                            className="small-size pr-1 mr-1"
                        />
                        {page.label}
                    </button>

                    <button
                        onClick={() => handleUnPinPage(page)}
                        className="flex items-center justify-center w-6 h-6 mr-4 bg-gray-100 rounded-md border border-gray-200"
                    >
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <FontAwesomeIcon
                                        icon={faMapPin}
                                        className="small-icon text-gray-600"
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
            {!pinnedPages.map((page) => page.label)?.includes(selectedPage.label) && (
                <div key={selectedPage.label} className="flex items-center justify-between hover:bg-gray-100 hover:font-semibold">
                    <button
                        className={`flex items-start px-4 py-2 font-bold text-gray-700`}
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
                        <p>{selectedPage.label}</p>
                    </button>
                    <div className="mr-4">
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
                </div>
            )}
        </div>
    );
};

export default PinnedPagesResults;
