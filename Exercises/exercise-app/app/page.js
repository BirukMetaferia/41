
import OrderStatus from "./orders/OrderStatus";
import { getOrder } from "../lib/orders";

export default async function Home() {
  const initialOrder = await getOrder();

  return (
    <main style={{ padding: "2rem" }}>
      <OrderStatus initialOrder={initialOrder} />
    </main>
  );
}
