import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce"; // Assuming lodash is available
import { PageStructure, pagesStructure } from "@/config/pages.config";

export interface HeaderSearchResult {
    label: string;
    link: string;
    // TODO: add other properties ranking or highlighting
}

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

        const lowerCaseQuery = query.toLowerCase();
        const filteredResults = flatPages.filter((page) =>
            page.label.toLowerCase().includes(lowerCaseQuery)
        );

        setSearchResults(filteredResults);
    };

    // Move the debounced function outside of the hook to prevent re-creation on every render
    const debouncedSearch = useCallback(debounce(search, 300), []);

    useEffect(() => {
        debouncedSearch(inputQuery);
        return () => debouncedSearch.cancel();
    }, [inputQuery, debouncedSearch]);

    return searchResults;
};
