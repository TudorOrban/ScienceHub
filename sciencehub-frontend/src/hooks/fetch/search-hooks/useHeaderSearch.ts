import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce"; // Assuming lodash is available
import { PageStructure, pagesStructure } from "@/src/config/pages.config";

export interface HeaderSearchResult {
    label: string;
    link: string;
    // TODO: add other properties ranking or highlighting
}

/**
 * Special search for Header. To be upgraded in the future to include searching ScienceHub data.
 */
const flattenPages = (pages: PageStructure[]): HeaderSearchResult[] => {
    let results: HeaderSearchResult[] = [];

    pages.forEach((page) => {
        results.push({ label: page.label, link: page.link });

        if (page.children) {
            results = results.concat(flattenPages(page.children));
        }
    });

    return results;
};

const flatPages = flattenPages(pagesStructure);

export const useHeaderSearch = (inputQuery: string) => {
    const [searchResults, setSearchResults] = useState<HeaderSearchResult[]>([]);

    const search = (query: string) => {
        // Default results
        if (!query) {
            setSearchResults([
                {
                    label: "Home",
                    link: "/",
                },
                {
                    label: "Workspace",
                    link: "/workspace",
                },
                {
                    label: "Browse",
                    link: "/browse",
                },
                {
                    label: "Resources",
                    link: "/resources",
                },
            ]);
            return;
        }

        // TODO: Replace with a relevance computation and sort
        const lowerCaseQuery = query.toLowerCase();
        const filteredResults = flatPages.filter((page) =>
            page.label.toLowerCase().includes(lowerCaseQuery)
        );

        setSearchResults(filteredResults);
    };

    const debouncedSearch = useCallback(debounce(search, 300), []);

    useEffect(() => {
        debouncedSearch(inputQuery);
        return () => debouncedSearch.cancel();
    }, [inputQuery, debouncedSearch]);

    return searchResults;
};
