# Data Fetching Strategy - Addis Eats

## 1. Server-rendered initial order

- Data source: `/api/orders/1`, fetched by `getOrder(1)` in `lib/orders.js`.
- Fetching rule: The server fetch uses `cache: "no-store"` to avoid reusing a cached server response.
- Initial rendering: The server passes the order data to the client components.
- Reasoning: Rendering the order on the server makes its initial status available before client-side revalidation begins.

## 2. Client order-status query

- Query key: `/api/orders/1`
- Fetcher: Shared `fetcher` from `lib/fetcher.js`.
- Initial data: Server-provided `fallbackData` prevents an empty initial loading state when the data is available.
- Refresh rule: `refreshInterval: 5000` requests updated status approximately every five seconds while polling is active.
- Shared consumers: `OrderStatus` and `OrderStatusIndicator` use the same key.
- Reasoning: Order status can change while the user is viewing the page, so periodic revalidation keeps it current. Sharing the key allows SWR to share cached data and deduplicate overlapping requests.

## 3. Menu search

- Query key: `/api/menu?q=<encoded-search>&page=<page-number>`
- Empty search key: `null`, so SWR does not fetch while the search term is empty.
- Fetcher: Shared `fetcher` from `lib/fetcher.js`.
- Debounce rule: Wait 500 milliseconds after typing stops before updating the debounced search term.
- Refresh rule: No polling; changing the debounced term changes the key and triggers a request.
- Previous data: `keepPreviousData: true`.
- Reasoning: Debouncing reduces unnecessary requests, and retaining previous data avoids an empty-list flash while the next search loads.

## 4. Menu pagination

- Query key: The menu URL containing both the encoded search term and page number.
- Page state: The `page` query-string parameter in the URL.
- Refresh rule: No polling; navigating to another page changes the key and triggers a request for that page.
- Previous data: `keepPreviousData: true`.
- Reasoning: Including the page in the key keeps different pages distinct in the cache, while the URL makes a page linkable and shareable.

## 5. Cache behavior and stale time

This project uses SWR, not TanStack Query. SWR does not support TanStack Query's `staleTime` option, so no explicit `staleTime` is configured. SWR uses its cache, request deduplication, and revalidation behavior. By default, it can revalidate when a component mounts or the browser window regains focus, subject to the query configuration. The order query additionally uses `refreshInterval: 5000` because order status needs regular updates. Menu queries do not poll because new search terms and page numbers change their keys.

## 6. Error handling

All client-side SWR queries use the shared `fetcher` from `lib/fetcher.js`. The fetcher throws an error when the HTTP response is not OK, allowing SWR to expose the error to the component.

## 7. Network tab verification

When typing several characters quickly, the 500-millisecond debounce should result in one request for the final search term rather than one request per character. Clearing the search should produce no menu request because the SWR key becomes `null`. The order query should show one initial request shared by its components, followed by periodic requests about every five seconds.
