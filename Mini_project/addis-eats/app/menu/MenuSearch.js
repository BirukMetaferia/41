"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";

export default function MenuSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const urlQuery = searchParams.get("q") || "";

  const [search, setSearch] = useState(urlQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(urlQuery);
  const [displayedData, setDisplayedData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set("q", debouncedSearch);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const queryString = params.toString();
    const currentQuery = searchParams.get("q") || "";

    if (currentQuery !== debouncedSearch) {
      router.replace(
        queryString ? `${pathname}?${queryString}` : pathname,
        { scroll: false }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const key = debouncedSearch
    ? `/api/menu?q=${encodeURIComponent(debouncedSearch)}&page=${urlPage}`
    : null;

  const { error, isLoading, isValidating } = useSWR(key, fetcher, {
    keepPreviousData: true,
    onSuccess: (result) => {
      setDisplayedData(result);
    },
  });

  const visibleData = search.trim() ? displayedData : null;

  function goToPage(nextPage) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));

    if (debouncedSearch) {
      params.set("q", debouncedSearch);
    } else {
      params.delete("q");
    }

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  return (
    <section>
      <h1>Search the Menu</h1>

      <input
        type="search"
        placeholder="Search dishes..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {isLoading && !visibleData && <p>Loading dishes...</p>}

      {isValidating && visibleData && (
        <p>Updating results...</p>
      )}

      {error && (
        <p role="alert">
          Could not load dishes: {error.message}
        </p>
      )}

      {visibleData?.dishes?.length === 0 && !isValidating && (
        <p>No dishes found.</p>
      )}

      {visibleData?.dishes?.length > 0 && (
        <ul>
          {visibleData.dishes.map((dish) => (
            <li key={dish.id}>
              {dish.name} - {dish.price} ETB
            </li>
          ))}
        </ul>
      )}

      {visibleData && visibleData.totalPages > 1 && (
        <nav aria-label="Menu pagination">
          <button
            type="button"
            onClick={() => goToPage(urlPage - 1)}
            disabled={urlPage <= 1}
          >
            Previous
          </button>

          <span>
            {" "}Page {visibleData.page} of{" "}
            {visibleData.totalPages}{" "}
          </span>

          <button
            type="button"
            onClick={() => goToPage(urlPage + 1)}
            disabled={urlPage >= visibleData.totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}


