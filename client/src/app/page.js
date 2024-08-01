import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";

// export const dynamic = 'force-static';
export const runtime = 'edge'
export default function Home() {
  return (
    <div>
      <Hero />
      {/* <Option />    */}

      <Feature />
      <ProductList />

     
    </div>
  );
}
