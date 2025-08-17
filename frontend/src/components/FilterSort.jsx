function FilterSort({
  filters,
  setFilters,
  sort,
  setSort,
  order,
  setOrder,
  onApply,
  includeRole,
  includeEmail
}) {
  const placeholder = includeEmail
    ? (includeRole
        ? "Search by name, email, address, or role..."
        : "Search by name, email, or address...")
    : "Search by name or address...";

  return (
    <div className="mb-6 flex flex-wrap gap-2 items-center">
    
      <input
        className="bg-gray-800 text-white border border-gray-600 p-2 rounded min-w-[300px] w-full sm:w-auto"
        placeholder={placeholder}
        value={filters.search || ""}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      {/* Sort dropdown */}
      <select
        className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="name">Name</option>
        <option value="address">Address</option>
        {includeEmail && <option value="email">Email</option>}
        {includeRole && <option value="role">Role</option>}
      </select>

      {/* Order dropdown */}
      <select
        className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
      >
        <option value="ASC">Ascending</option>
        <option value="DESC">Descending</option>
      </select>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        onClick={onApply}
      >
        Apply
      </button>
    </div>
  );
}

export default FilterSort;
