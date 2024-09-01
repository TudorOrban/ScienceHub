import { workTypeIconMap } from "@/src/components/cards/small-cards/SmallWorkCard";
import { Work } from "@/src/types/workTypes";
import { faQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEditorContext } from "@/src/contexts/general/EditorContext";
import { useEffect, useRef } from "react";

interface WorkCards {
    window: number;
    windowWidth?: number;
}

const WorkCards: React.FC<WorkCards> = ({ window, windowWidth }) => {
    const {
        activeWindows,
        setActiveWindows,
        currentWindow,
        setCurrentWindow,
        openedWorkIdentifiers,
        setOpenedWorkIdentifiers,
        openedWorks,
        setOpenedWorks,
        currentWork,
        setCurrentWork,
        selectedSubmission,
        workSubmissions,
    } = useEditorContext();

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (scrollContainerRef.current) {
                // Prevent vertical scrolling
                event.preventDefault();
                // Scroll horizontally instead
                scrollContainerRef.current.scrollLeft += event.deltaY;
            }
        };

        const scrollContainer = scrollContainerRef.current;
        scrollContainer?.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            scrollContainer?.removeEventListener("wheel", handleWheel);
        };
    }, []);

    return (
        <div
            ref={scrollContainerRef}
            className="flex items-center w-full bg-gray-50 space-x-0 border-b border-gray-200 overflow-x-auto scroll-auto"
        >
            {openedWorks &&
                Object.keys(openedWorks).includes(window.toString()) &&
                Object.values(openedWorks[window]).map((work, index) => (
                    <div
                        key={index}
                        className={`flex items-center min-w-20 h-10 p-2 border border-gray-300 rounded-t-lg hover:bg-gray-100 ${
                            work.id === openedWorks[window][currentWork[window]]?.id &&
                            work.workType === openedWorks[window][currentWork[window]]?.workType
                                ? "bg-gray-100"
                                : "bg-white"
                        } ${work.isModified ? "text-blue-700" : "text-black"}`}
                    >
                        <button
                            onClick={() => {
                                setCurrentWindow(window);
                                setCurrentWork({
                                    ...currentWork,
                                    [window]: index + 1,
                                });
                            }}
                            className="flex items-center whitespace-nowrap max-w-32"
                        >
                            <FontAwesomeIcon
                                icon={workTypeIconMap(work.workType || "").icon || faQuestion}
                                className="ml-2 mr-1 "
                                style={{
                                    color: workTypeIconMap(work.workType || "").color || "#22222",
                                    fontSize: "12px",
                                }}
                            />
                            <div
                                className="text-ellipsis overflow-hidden text-base"
                                style={{ fontWeight: 500 }}
                            >
                                {work.title}
                            </div>
                            {work.isChanged && (
                                <div className="bg-gray-800 w-2 h-2 ml-1 mb-1 rounded-full border border-gray-300"></div>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                if (!openedWorkIdentifiers) return;
                                const currentWindowWorkIdentifiers = openedWorkIdentifiers[window];

                                // Find the key corresponding to work.id
                                const workKeyToRemove = Object.keys(
                                    currentWindowWorkIdentifiers
                                ).find(
                                    (key) =>
                                        currentWindowWorkIdentifiers[Number(key) || 0].workId ===
                                            work.id.toString() &&
                                        currentWindowWorkIdentifiers[Number(key) || 0].workType ===
                                            work.workType
                                );

                                if (workKeyToRemove) {
                                    const {
                                        [Number(workKeyToRemove) || 0]: _,
                                        ...filteredWorkIdentifiers
                                    } = currentWindowWorkIdentifiers;

                                    // Update the state with the filtered works
                                    setOpenedWorkIdentifiers({
                                        ...openedWorkIdentifiers,
                                        [window]: filteredWorkIdentifiers,
                                    });

                                    // Check and update currentWork if the closed work is the current work
                                    if (Object.keys(filteredWorkIdentifiers).length === 0) {
                                        // Remove the window from openedWindows
                                        const updatedOpenedWindows = activeWindows.filter(
                                            (w) => w !== window
                                        );
                                        setActiveWindows(updatedOpenedWindows);

                                        // Additional handling if needed when a window is closed
                                    } else {
                                        // Existing logic for updating currentWork...
                                        if (currentWork[window] === parseInt(workKeyToRemove)) {
                                            const remainingWorkIds =
                                                Object.keys(filteredWorkIdentifiers).map(Number);

                                            if (remainingWorkIds.length > 0) {
                                                setCurrentWork({
                                                    ...currentWork,
                                                    [window]: remainingWorkIds[0],
                                                });
                                            } else {
                                                const { [window]: _, ...updatedCurrentWork } =
                                                    currentWork;
                                                setCurrentWork(updatedCurrentWork);
                                            }
                                        }
                                    }
                                }
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="small-icon text-gray-700 hover:text-red-700 ml-2 mr-1"
                            />
                        </button>
                    </div>
                ))}
        </div>
    );
};

export default WorkCards;
