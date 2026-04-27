import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <Hero />
      <Catalog />
    </div>
  );
}
