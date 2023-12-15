import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useBrowseSearchContext } from "@/hooks/fetch/search-hooks/useBrowseSearchContext";
import { worksAvailableSearchOptions } from "@/utils/availableSearchOptionsAdvanced";
import { Select, SelectItem, SelectValue } from "../ui/select";
import { SelectContent, SelectTrigger } from "@radix-ui/react-select";
import { Toggle } from "../ui/toggle";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

type SearchInputProps = {
    placeholder: string;
    context?: string;
    searchMode?: "onClick" | "onInputChange";
    className?: string;
    inputClassName?: string;
};

const BrowseSearchInput: React.FC<SearchInputProps> = (
    params: SearchInputProps
) => {
    const context = useBrowseSearchContext(params.context);
    if (!context) {
        throw new Error(`SearchInput must be used within a SearchProvider`);
    }

    const {
        inputQuery,
        setInputQuery,
        searchByField,
        setSearchByField,
        caseSensitive,
        setCaseSensitive,
    } = context;

    const [localInputQuery, setLocalInputQuery] = useState<string>(inputQuery);
    const [openSearchBySelect, setOpenSearchBySelect] =
        useState<boolean>(false);
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

    const handleSearchBySelect = (searchByOption: string) => {
        setSearchByField(searchByOption);
    };

    switch (params.context) {
        case "Browse Projects":
        case "Browse Works":
        case "Browse Submissions":
        case "Browse Issues":
        case "Browse Reviews":
        case "Browse Discussions":
        case "Browse People":
            return (
                <div
                    className={`${params?.className} flex items-center my-6 mx-4`}
                >
                    <div className="relative border border-gray-300 rounded shadow-sm">
                        <input
                            type="text"
                            value={localInputQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={params.placeholder}
                            className={`p-3 pl-4 rounded flex-grow shadow-sm w-[24rem] md:w-[36rem] lg:w-[50rem] ${params.inputClassName}`}
                        />
                        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 bg-gray-100 text-gray-700">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Toggle
                                            className={`mr-4 w-12 h-12 border border-gray-300 ${
                                                caseSensitive
                                                    ? "bg-gray-200"
                                                    : " bg-white"
                                            }`}
                                            onClick={() =>
                                                setCaseSensitive(!caseSensitive)
                                            }
                                        >
                                            Aa
                                        </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white text-gray-800 text-sm">
                                        Case Sensitive
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <button
                                className="flex items-center whitespace-nowrap"
                                onClick={() =>
                                    setOpenSearchBySelect(!openSearchBySelect)
                                }
                            >
                                <div className="pr-2 hidden md:block">{"Search By "}</div>
                                <div className="font-semibold text-gray-900">
                                    {
                                        worksAvailableSearchOptions?.availableSearchByFieldOptions?.find(
                                            (option) =>
                                                option.value === searchByField
                                        )?.label
                                    }
                                </div>

                                <FontAwesomeIcon
                                    icon={faCaretDown}
                                    className="small-icon text-gray-700 ml-2"
                                />
                            </button>
                            {openSearchBySelect && (
                                <div className="absolute top-12 ml-10 flex flex-col items-center space-x-2 space-y-2 p-3 bg-white border border-gray-20 shadow-md rounded-md font-semibold hover:text-gray-900">
                                    {worksAvailableSearchOptions?.availableSearchByFieldOptions?.map(
                                        (option, index) => (
                                            <button
                                                key={index}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSearchByField(
                                                        option.value
                                                    );
                                                    setOpenSearchBySelect(
                                                        !openSearchBySelect
                                                    );
                                                }}
                                            >
                                                {option.value ===
                                                searchByField ? (
                                                    <div className="text-gray-900">
                                                        {option.label}
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-700">
                                                        {option.label}
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="bg-gray-800 text-white ml-2 mr-2 lg:mr-4  hover:bg-gray-900 hover:text-white whitespace-nowrap h-12 flex-shrink-0"
                        onClick={handleSearchClick}
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="small-icon md:mr-2"
                        />
                        <div className="text-lg hidden md:block">Search</div>
                    </Button>
                </div>
            );
        case undefined:
            return <div>Context not defined.</div>;
    }
};

export default BrowseSearchInput;
