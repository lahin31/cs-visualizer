"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { BPlusTreeVisualization } from "./b-plus-tree-visualization"

export const QueryVisualization = ({ 
    searchValue, 
    setSearchValue, 
    handleSearch 
}: { 
    searchValue: string, 
    setSearchValue: (value: string) => void, 
    handleSearch: () => void 
}) => {
  return (
    <div className="space-y-6">
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label htmlFor="search-value" className="text-sm font-medium mb-2 block">
              Search Value
            </label>
            <input
              id="search-value"
              type="number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full p-2 border border-input rounded bg-background h-[35px]"
              placeholder="Enter a key..."
            />
          </div>
          <Button onClick={handleSearch} className="w-full sm:w-auto mt-2 sm:mt-0 self-end h-[35px]">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <BPlusTreeVisualization isSearch={true} />

      <div>
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold">Search Process</h3>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="text-sm font-mono bg-muted p-3 rounded">
            SELECT * FROM users WHERE id = {searchValue || "?"};
          </div>
        </div>
      </div>
    </div>
  )
}
