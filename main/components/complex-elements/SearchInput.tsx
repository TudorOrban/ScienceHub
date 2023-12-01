import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useSearchContext } from "@/app/hooks/fetch/search-hooks/useSearchContext";

type SearchInputProps = {
    placeholder: string;
    context?: string;
    searchMode?: "onClick" | "onInputChange";
    className?: string;
    inputClassName?: string;
};

const SearchInput: React.FC<SearchInputProps> = (params: SearchInputProps) => {
    const context = useSearchContext(params.context);

    if (!context) {
        throw new Error(`SearchInput must be used within a SearchProvider`);
    }

    const { inputQuery, setInputQuery } = context;

    const [localInputQuery, setLocalInputQuery] = useState<string>(inputQuery);

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

    switch (params.context) {
        case "Header":
            return (
                <div className="flex items-center">
                    <input
                        type="text"
                        value={localInputQuery}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={params.placeholder}
                        className={`border py-2 pl-3 rounded-l text-black ${params.inputClassName}`}
                        style={{ height: "36px" }}
                    />
                    <Button
                        variant="default"
                        className="bg-gray-800 text-white w-10 h-8 border border-gray-400 rounded-l-none rounded-r hover:bg-gray-900 hover:text-white lg:mt-0"
                        onClick={handleSearchClick}
                        style={{ height: "36px" }}
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="small-icon"
                        />
                    </Button>
                </div>
            );

        case "Sidebar":
            return (
                <div className="flex items-center">
                    <input
                        type="text"
                        value={localInputQuery}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={params.placeholder}
                        className={`border w-96 p-2 rounded text-black shadow-sm ${params.inputClassName}`}
                        style={{ height: "40px" }}
                    />
                    <Button
                        variant="outline"
                        className="bg-gray-800 text-white w-10 hover:bg-gray-900 hover:text-white whitespace-nowrap lg:mt-0 flex-shrink-0"
                        onClick={handleSearchClick}
                        style={{ height: "40px" }}
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="small-icon"
                        />
                    </Button>
                </div>
            );

        case "Workspace General":
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
                    <Button
                        type="button"
                        variant="outline"
                        className="bg-gray-800 text-white mr-2 px-3 py-5 hover:bg-gray-900 hover:text-white whitespace-nowrap lg:mt-0 flex-shrink-0"
                        onClick={handleSearchClick}
                        style={{ height: "40px" }}
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="small-icon"
                        />
                    </Button>
                </div>
            );
        case "Project General":
            return (
                <div className={`${params?.className} flex items-center`}>
                    <input
                        type="text"
                        value={localInputQuery}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={params.placeholder}
                        className={`border w-96 p-2 rounded ${params.inputClassName}`}
                        style={{ height: "40px" }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="bg-gray-700 text-white ml-2 px-3 py-5 hover:bg-blue-700 hover:text-white whitespace-nowrap lg:mt-0 flex-shrink-0"
                        onClick={handleSearchClick}
                        style={{ height: "40px" }}
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="small-icon"
                        />
                    </Button>
                </div>
            );
        case "Browse Projects":
        case "Browse Works":
        case "Browse Submissions":
        case "Browse Discussions":
        case "Browse Works":
            return (
                <div className={`${params?.className} flex items-center my-6`}>
                    <input
                        type="text"
                        value={localInputQuery}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={params.placeholder}
                        className={`border border-gray-300 p-3 pl-4 rounded shadow-sm w-48 lg:w-96 ${params.inputClassName}`}
                    />
                    <Button
                        variant="outline"
                        className="bg-gray-800 text-white ml-2 mr-2 lg:mr-4  hover:bg-gray-900 hover:text-white whitespace-nowrap w-36 h-12 mt-2 lg:mt-0 flex-shrink-0"
                        onClick={handleSearchClick}
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="small-icon mr-2"
                        />
                        <div className="text-lg">Search</div>
                    </Button>
                </div>
            );
        case undefined:
            return <div>Context not defined.</div>;
    }
};

export default SearchInput;
