import Image from 'next/image'
import React from 'react'

function ChefProfile() {
  return (
      <div class="bg-background text-foreground">
          <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div class="flex flex-col items-start justify-center">
                      <div class="inline-block rounded-full bg-primary px-4 py-1 text-primary-foreground">Chef Profile</div>
                      <h1 class="mt-4 text-4xl font-bold tracking-tight">Sophia Delacroix</h1>
                      <p class="mt-4 text-lg text-muted-foreground">
                          Sophia is a passionate chef with over 10 years of experience in the culinary industry. She specializes in
                          creating delectable French-inspired dishes that are both visually stunning and bursting with flavor.
                      </p>
                      <div class="mt-6 flex flex-wrap gap-4">
                          <div class="rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground">
                              French Cuisine
                          </div>
                          <div class="rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground">
                              Gourmet Dishes
                          </div>
                          <div class="rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground">Desserts</div>
                          <div class="rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground">
                              Vegetarian Options
                          </div>
                      </div>
                      <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-6">
                          View Menu
                      </button>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                      <Image
                          src="/vercel.svg"
                          width="300"
                          height="300"
                          alt="Chef's Dish 1"
                          class="rounded-lg object-cover"

                      />
                      <Image
                          src="/vercel.svg"
                          width="300"
                          height="300"
                          alt="Chef's Dish 2"
                          class="rounded-lg object-cover"

                      />
                      <Image
                          src="/vercel.svg"
                          width="300"
                          height="300"
                          alt="Chef's Dish 3"
                          class="rounded-lg object-cover"

                      />
                      <Image
                          src="/vercel.svg"
                          width="300"
                          height="300"
                          alt="Chef's Dish 4"
                          class="rounded-lg object-cover"

                      />
                  </div>
              </div>
          </div>
      </div>
  )
}

export default ChefProfile