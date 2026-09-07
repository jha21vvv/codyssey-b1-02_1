import React, { createContext, useContext, useState, useMemo } from "react";

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [platformFilter, setPlatformFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const value = useMemo(() => ({
    platformFilter,
    setPlatformFilter,
    searchTerm,
    setSearchTerm
  }), [platformFilter, searchTerm]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilter must be used within a FilterProvider");
  return context;
}