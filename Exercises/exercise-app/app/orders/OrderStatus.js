
"use client";

import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";

export default function OrderStatus({ initialOrder }) {
  const { data, error, isLoading } = useSWR(
    "/api/orders/1",
    fetcher,
    {
      fallbackData: initialOrder,
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  if (error) {
    return <p>Could not load order status: {error.message}</p>;
  }

  if (isLoading && !data) {
    return <p>Loading order status...</p>;
  }

  if (!data) return <p>Order not found.</p>;

  return (
    <section>
      <h1>Order Status</h1>
      <p>Order ID: {data.id}</p>
      <p>Status: {data.status}</p>
    </section>
  );
}
