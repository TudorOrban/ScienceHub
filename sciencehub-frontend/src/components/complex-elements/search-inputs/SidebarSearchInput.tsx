"use client";

import Popover from "@/src/components/light-simple-elements/Popover";
import { useHeaderSearch } from "@/src/hooks/fetch/search-hooks/useHeaderSearch";
import { faQuestion, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import HeaderSearchResults from "./HeaderSearchResults";

interface SidebarSearchInputProps {
    inputQuery: string;
    setInputQuery: (inputQuery: string) => void;
    inputClassname?: string;
}

/**
 * Specialized Search input component for the Sidebar. Not currently in use.
 */
const SidebarSearchInput: React.FC<SidebarSearchInputProps> = ({
    inputClassname,
    inputQuery,
    setInputQuery,
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setInputQuery(inputValue);
    };

    const searchResults = useHeaderSearch(inputQuery);

    useEffect(() => {
        const searchResNotEmpty = searchResults?.length > 0;
        if (isPopoverOpen != searchResNotEmpty) {
            setIsPopoverOpen(searchResNotEmpty);
        }
    }, [searchResults]);

    return (
        <Popover
            button={{
                label: "",
                icon: faQuestion,
            }}
            buttonChildren={
                <div className="w-full flex items-center rounded-md">
                    <input
                        type="text"
                        value={inputQuery}
                        onChange={handleInputChange}
                        onFocus={() => setIsPopoverOpen(true)}
                        placeholder={"Search ScienceHub"}
                        className={` h-full border border-gray-200 py-2 pl-3 rounded-md text-black focus:outline-none ${
                            inputClassname || ""
                        }`}
                    />
                    <button
                        className="h-full bg-gray-800 text-white w-8 border border-gray-400 rounded-l-none rounded-r hover:bg-gray-900 hover:text-white lg:mt-0"
                        onClick={() => {}}
                    >
                        <FontAwesomeIcon icon={faSearch} className="small-icon" />
                    </button>
                </div>
            }
            isOpen={isPopoverOpen}
            setIsOpen={setIsPopoverOpen}
        >
            <HeaderSearchResults
                searchResults={searchResults}
                className={`${inputClassname || ""}`}
            />
        </Popover>
    );
};

export default SidebarSearchInput;
