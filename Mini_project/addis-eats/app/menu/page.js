import { Suspense } from "react";
import MenuSearch from "./MenuSearch";

export default function MenuPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <Suspense fallback={<p>Loading menu...</p>}>
        <MenuSearch />
      </Suspense>
    </main>
  );
}
