"use client";

import Popover from "@/src/components/light-simple-elements/Popover";
import { useHeaderSearch } from "@/src/hooks/fetch/search-hooks/useHeaderSearch";
import { faQuestion, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import HeaderSearchResults from "./HeaderSearchResults";

interface HeaderSearchInputProps {
    inputClassname?: string;
}

/**
 * Specialized search input for header.
 * Uses a special header search that currently looks through ScienceHub pages.
 * To be upgraded in the future to search through all ScienceHub content.
 */
const HeaderSearchInput: React.FC<HeaderSearchInputProps> = ({ inputClassname }) => {
    const [inputQuery, setInputQuery] = useState<string>("");
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setInputQuery(inputValue);
    };

    const searchResults = useHeaderSearch(inputQuery);

    return (
        <Popover
            button={{
                label: "",
                icon: faQuestion,
            }}
            buttonChildren={
                <div className="flex items-center rounded-r-md">
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
                        className="h-full bg-gray-800 text-white w-10 border border-gray-400 rounded-l-none rounded-r-md hover:bg-gray-900 hover:text-white lg:mt-0"
                        onClick={() => {}}
                    >
                        <FontAwesomeIcon icon={faSearch} className="small-icon" />
                    </button>
                </div>
            }
            isOpen={isPopoverOpen}
            setIsOpen={setIsPopoverOpen}
            className="rounded-md"
        >
            <HeaderSearchResults
                searchResults={searchResults}
                className={`${inputClassname || ""}`}
            />
        </Popover>
    );
};

export default HeaderSearchInput;
