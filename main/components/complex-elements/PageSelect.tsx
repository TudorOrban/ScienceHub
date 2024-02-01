import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { PageSelectContext } from "@/contexts/general/PageSelectContext";

interface PageSelectProps {
    numberOfElements: number;
    itemsPerPage: number;
}

const PageSelect: React.FC<PageSelectProps> = ({
    numberOfElements,
    itemsPerPage,
}) => {
    const numberOfPages = Math.ceil(numberOfElements / itemsPerPage);

    // Select page context
    const pageSelectContext = useContext(PageSelectContext);
    if (!pageSelectContext) {
        throw new Error("DeleteModeContext must be used within a provider");
    }
    const { selectedPage } = pageSelectContext;

    const isBreakable = numberOfPages > 8;

    const pagesArray = [...Array(numberOfPages).keys()]
        .map((x) => x + 1)
        .filter((page) => page < 7 || page > numberOfPages - 2);

    const handleSelectPage = (page: number) => {
        if (pagesArray.includes(page)) {
            setSelectedPage(page);
        }
    };

    return (
        <div
            className={`inline-flex items-center space-x-1 py-1.5 bg-gray-50 border border-gray-300 rounded-md shadow-sm`}
        >
            {isBreakable && (
                <button
                    className="bg-gray-50 text-gray-500 hover:bg-white hover:text-gray-700 p-2 ml-2"
                    onClick={() => handleSelectPage(selectedPage - 1)}
                >
                    <FontAwesomeIcon
                        icon={faCaretLeft}
                        className="small-icon text-gray-600"
                    />
                </button>
            )}
            {numberOfPages > 0 ?
                pagesArray.map((page) => (
                    <div key={page} className="text-gray-700 text-lg">
                        {page !== 6 ? (
                            <div>
                                <button
                                    className="bg-gray-50 text-gray-500 hover:bg-white hover:text-gray-700 h-10 w-10"
                                    onClick={() => handleSelectPage(page)}
                                >
                                    {selectedPage === page ? (
                                        <div className="text-blue-600">
                                            {page}
                                        </div>
                                    ) : (
                                        <div className="">{page}</div>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="text-xl mx-2">{"..."}</div>
                        )}
                    </div>
                )) : null}
            {isBreakable && (
                <button
                    className="bg-gray-50 text-gray-500 hover:bg-white hover:text-gray-700 py-2 pl-3 pr-4"
                    onClick={() => handleSelectPage(selectedPage + 1)}
                >
                    <FontAwesomeIcon
                        icon={faCaretRight}
                        className="small-icon text-gray-600"
                    />
                </button>
            )}
        </div>
    );
};

export default PageSelect;
