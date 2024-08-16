import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";

// export const dynamic = 'force-static';

export default function Home() {
  return (
    <div className="dark bg-background">
      <Hero />
      {/* <Option />    */}

      <Feature />
      <ProductList />

     
    </div>
  );
}
