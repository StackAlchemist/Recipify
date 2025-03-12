import { useState } from "react";
import axios from "axios";

const SearchBar = ({ setLoading, setSearchData }) => {
    const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState([])

    const handleSearch = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (!query.trim()) return;
    
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/search?q=${query}`;
        console.log("Search API URL:", apiUrl); // ✅ Debug
    
        try {
            const response = await axios.get(apiUrl);
            console.log("Search Response:", response.data); // ✅ Debug
            setSearchData(response.data);
        } catch (err) {
            console.error("Search Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
        onSubmit={handleSearch} 
        className="flex items-center gap-2 bg-white shadow-md rounded-lg p-2 w-full max-w-md border border-gray-300"
    >
        {/* Search Icon */}
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.65-5.15a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>

        {/* Search Input */}
        <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
        />

        {/* Clear (X) Button */}
        {query && (
            <button type="button" className="p-2" onClick={() => {setQuery("")
                setSearchData('')
            }}>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        )}

        {/* Search Button */}
        <button 
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
        >
            Search
        </button>
    </form>
    );
};

export default SearchBar;
