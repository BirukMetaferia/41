
"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";

export default function ProductSearch() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const key = debouncedSearch
    ? `/api/products?q=${encodeURIComponent(debouncedSearch)}`
    : null;

  const { data, error, isLoading } = useSWR(key, fetcher);

  return (
    <section>
      <h1>Product Search</h1>

      <input
        type="search"
        placeholder="Search products..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {!debouncedSearch && (
        <p>Enter a product name to search.</p>
      )}

      {debouncedSearch && isLoading && (
        <p>Loading products...</p>
      )}

      {error && (
        <p role="alert">
          Failed to load products: {error.message}
        </p>
      )}

      {data && data.length === 0 && (
        <p>No products found. Try another search.</p>
      )}

      {data && data.length > 0 && (
        <ul>
          {data.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
