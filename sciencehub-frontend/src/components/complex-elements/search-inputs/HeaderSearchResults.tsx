import { HeaderSearchResult } from "@/src/hooks/fetch/search-hooks/useHeaderSearch";
import Link from "next/link";

interface HeaderSearchResultsProps {
    searchResults: HeaderSearchResult[];
    className?: string;
}

/**
 * Component displaying results of useHeaderSearch in HeaderSearchInput
 */
const HeaderSearchResults: React.FC<HeaderSearchResultsProps> = ({ searchResults, className }) => {

    if (searchResults.length === 0) {
        return (
            <div className={`px-4 py-2 h-20 ${className || ""}`}>
                <h2 className="text-lg font-semibold pb-2">No results found.</h2>
                <Link href="/browse" className="text-blue-600 hover:text-blue-700">Go to Browse</Link>
            </div>
        )
    } 

    return (
        <ul className={`p-2 space-y-2 m-0 bg-white border border-gray-200 rounded-b-md shadow-sm ${className || ""}`}>
            {searchResults.map((result) => (
                <li key={result.link} className="px-2">
                    <Link href={result.link} >
                        <h2 className="font-semibold text-lg">{result.label}</h2>
                        <p className="text-gray-800">{result.link}</p>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default HeaderSearchResults;
