"use client";

import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";

function OrderStatusIndicator({ initialOrder }) {
  const { data } = useSWR("/api/orders/1", fetcher, {
    fallbackData: initialOrder,
    refreshInterval: 5000,
  });

  return <p>Shared status indicator: {data.status}</p>;
}

export default function OrderStatus({ initialOrder }) {
  const { data, error } = useSWR(
    "/api/orders/1",
    fetcher,
    {
      fallbackData: initialOrder,
      refreshInterval: 5000,
    }
  );

  if (error) {
    return <p role="alert">Could not load order status.</p>;
  }

  return (
    <section>
      <h1>Order Status</h1>
      <p>Order ID: {data.id}</p>
      <p>Status: {data.status}</p>
      <OrderStatusIndicator initialOrder={initialOrder} />
    </section>
  );
}
