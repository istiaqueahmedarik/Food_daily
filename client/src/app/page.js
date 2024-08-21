import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import HeroCover from "@/components/HeroCover";
import Popular from "@/components/Popular";
import ProductList from "@/components/ProductList";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import PopFoodCat from "@/components/PopFoodCat";
import TopChef from "@/components/TopChef";
import PopFood from "@/components/PopFood";
import { Suspense } from "react";
import LoadingSection from "@/components/LoadingSection";
import { OrderType } from "@/components/OrderType";

// export const dynamic = 'force-static';
export const experimental_ppr = true;

export default function Home() {
 
  return (
    <div className="  bg-background">
      <Suspense fallback={<LoadingSection />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <Feature />
      </Suspense>
      <div className="container mx-auto p-4 space-y-8">
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Popular Food Categories</h2>
          <Suspense fallback={<LoadingSection />}>
            <PopFoodCat />
          </Suspense>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Popular Foods</h2>
          <Suspense fallback={<LoadingSection />}>
            <PopFood />
          </Suspense>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Top Chefs</h2>
          <Suspense fallback={<LoadingSection />}>
            <TopChef />
          </Suspense>
        </section>
        <Suspense fallback={<LoadingSection />}>
          <ProductList />
        </Suspense>
      </div>
    </div>
    
        

  );
}
