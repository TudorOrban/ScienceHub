import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearchContext } from "@/src/hooks/fetch/search-hooks/useSearchContext";

type SearchInputProps = {
    placeholder: string;
    context?: string;
    searchMode?: "onClick" | "onInputChange";
    className?: string;
    inputClassName?: string;
};

/**
 * General Search input component. Uses a specified search context to manage the search query.
 */
const SearchInput: React.FC<SearchInputProps> = (params: SearchInputProps) => {
    // Input query
    const context = useSearchContext(params.context);
    if (!context) {
        throw new Error(`SearchInput must be used within a SearchProvider`);
    }
    const { inputQuery, setInputQuery } = context;

    const [localInputQuery, setLocalInputQuery] = useState<string>(inputQuery);

    // Handlers
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setLocalInputQuery(inputValue);

        if (params.searchMode === "onInputChange") {
            setInputQuery(inputValue);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setInputQuery(localInputQuery);
        }
    };

    const handleSearchClick = () => {
        if (params.searchMode === "onClick") {
            setInputQuery(localInputQuery);
        }
    };

    return (
        <div className={`${params?.className} flex items-center`}>
            <input
                type="text"
                value={localInputQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={params.placeholder}
                className={`border w-96 px-2 rounded ${params.inputClassName}`}
                style={{ height: "40px" }}
            />
            <button type="button" className="search-button" onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faSearch} className="small-icon" />
            </button>
        </div>
    );
};

export default SearchInput;
