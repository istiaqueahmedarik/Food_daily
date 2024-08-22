import { getBlur } from '@/util'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function FoodDetails() {
  return (
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
          <div className="grid gap-4">
              <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60}
                  src="/food.svg"
                  alt="Food Image"
                  width="600"
                  height="600"
                  className="aspect-square object-cover border border-input w-full rounded-lg overflow-hidden"
              />
          </div>
          <div className="grid gap-4 md:gap-10 items-start">
              <div className="grid gap-2">
                  <h1 className="font-bold text-3xl">Beef Teriyaki Bowl</h1>
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-0.5">
                          <Sparkles size={20} />
                      </div>
                      <div className="text-muted-foreground">4.2</div>
                  </div>
                  <p className="text-muted-foreground">Beef Teriyaki BowlBeef Teriyaki BowlBeef Teriyaki BowlBeef Teriyaki BowlBeef Teriyaki BowlBeef Teriyaki Bowl</p>
              </div>
              <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                      <div className="font-bold text-2xl">$12.99</div>

                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 bg-[#ffffffbe] hover:bg-white text-black">
                          Add to Cart
                      </button>
                  </div>
                  <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
                  <div className="grid gap-2">
                      <div className="font-semibold text-lg">Nut</div>
                      <div className="grid md:grid-cols-2 gap-4">
                          <div className="grid gap-1">
                              <div className="text-muted-foreground">Calories</div>
                              <div>65</div>
                          </div>
                          <div className="grid gap-1">
                              <div className="text-muted-foreground">Protein</div>
                              <div>35g</div>
                          </div>
                          <div className="grid gap-1">
                              <div className="text-muted-foreground">Carbs</div>
                              <div>75g</div>
                          </div>
                          <div className="grid gap-1">
                              <div className="text-muted-foreground">Fat</div>
                              <div>25g</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default FoodDetails