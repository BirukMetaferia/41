import { NextResponse } from "next/server";

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
  { id: 3, name: "Keyboard" },
  { id: 4, name: "Monitor" },
  { id: 5, name: "Headphones" },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").toLowerCase();

  const results = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );

  return NextResponse.json(results);
}
