export async function getOrder(id = 1) {
  const response = await fetch(
    `http://localhost:3000/api/orders/${id}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Failed to load order: ${response.status}`);
  }

  return response.json();
}
