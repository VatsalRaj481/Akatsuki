import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      className="form-input w-64 rounded-xl text-white bg-[#243647] px-4 py-2"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

export default Search;
