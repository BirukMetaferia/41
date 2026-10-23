import OrderStatus from "./orders/OrderStatus";
import { getOrder } from "../lib/orders";

export const instant = false;

export default async function Home() {
  const initialOrder = await getOrder(1);

  return (
    <main style={{ padding: "2rem" }}>
      <OrderStatus initialOrder={initialOrder} />
    </main>
  );
}
