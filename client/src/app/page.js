import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import HeroCover from "@/components/HeroCover";
import Popular from "@/components/Popular";
import ProductList from "@/components/ProductList";
import Image from "next/image";

// export const dynamic = 'force-static';

export default function Home() {
  return (
    <div className="dark bg-background">
      <Hero />


      <Feature />
      <Popular />


    </div>
    
        

  );
}
