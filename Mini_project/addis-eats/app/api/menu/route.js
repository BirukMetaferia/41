import { NextResponse } from "next/server";

const dishes = [
  { id: 1, name: "Doro Wat", category: "Ethiopian", price: 450 },
  { id: 2, name: "Tibs", category: "Ethiopian", price: 380 },
  { id: 3, name: "Shiro", category: "Ethiopian", price: 220 },
  { id: 4, name: "Kitfo", category: "Ethiopian", price: 500 },
  { id: 5, name: "Pasta", category: "Italian", price: 300 },
  { id: 6, name: "Burger", category: "Fast Food", price: 280 },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = 2;

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(query)
  );

  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / pageSize));
  const start = (page - 1) * pageSize;
  const results = filteredDishes.slice(start, start + pageSize);

  return NextResponse.json({
    dishes: results,
    page,
    totalPages,
    total: filteredDishes.length,
  });
}



