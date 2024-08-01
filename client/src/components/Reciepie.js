import Image from 'next/image'
import React from 'react'

function Reciepie() {
  return (
      <div className="w-full">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
              <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
                  <Image
                      src="/food.svg"
                      width="550"
                      height="510"
                      alt="Dish"
                      className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  />
                  <div className="space-y-4">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Creamy Garlic Parmesan Chicken</h1>
                      <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                          Tender chicken breasts in a rich and creamy garlic parmesan sauce, perfect for a weeknight dinner.
                      </p>
                  </div>
              </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                  <div className="grid gap-10">
                      <div>
                          <h2 className="text-2xl font-bold">Ingredients</h2>
                          <ul className="mt-4 grid gap-2 text-muted-foreground">
                              <li>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="mr-2 inline-block h-4 w-4"
                                  >
                                      <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                  4 boneless, skinless chicken breasts
                              </li>
                              <li>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="mr-2 inline-block h-4 w-4"
                                  >
                                      <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                  2 tablespoons olive oil
                              </li>
                              <li>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="mr-2 inline-block h-4 w-4"
                                  >
                                      <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                  4 cloves garlic, minced
                              </li>
                              <li>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="mr-2 inline-block h-4 w-4"
                                  >
                                      <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                  1 cup heavy cream
                              </li>
                              <li>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="mr-2 inline-block h-4 w-4"
                                  >
                                      <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                  1/2 cup grated parmesan cheese
                              </li>
                              <li>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="mr-2 inline-block h-4 w-4"
                                  >
                                      <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                  1 teaspoon dried parsley
                              </li>
                              <li>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="mr-2 inline-block h-4 w-4"
                                  >
                                      <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                  Salt and pepper to taste
                              </li>
                          </ul>
                      </div>
                      <div>
                          <h2 className="text-2xl font-bold">Instructions</h2>
                          <ol className="mt-4 grid gap-4 text-muted-foreground">
                              <li>
                                  <div className="flex items-start gap-2">
                                      <div className="rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">1</div>
                                      <div>Season the chicken breasts with salt and pepper.</div>
                                  </div>
                              </li>
                              <li>
                                  <div className="flex items-start gap-2">
                                      <div className="rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">2</div>
                                      <div>
                                          In a large skillet, heat the olive oil over medium-high heat. Add the chicken and cook for 5-6
                                          minutes per side, until golden brown and cooked through. Remove the chicken from the skillet and
                                          set aside.
                                      </div>
                                  </div>
                              </li>
                              <li>
                                  <div className="flex items-start gap-2">
                                      <div className="rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">3</div>
                                      <div>
                                          In the same skillet, add the minced garlic and cook for 1 minute, stirring constantly, until
                                          fragrant.
                                      </div>
                                  </div>
                              </li>
                              <li>
                                  <div className="flex items-start gap-2">
                                      <div className="rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">4</div>
                                      <div>
                                          Reduce the heat to low and add the heavy cream, parmesan cheese, and dried parsley. Stir until the
                                          cheese has melted and the sauce is smooth.
                                      </div>
                                  </div>
                              </li>
                              <li>
                                  <div className="flex items-start gap-2">
                                      <div className="rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">5</div>
                                      <div>
                                          Add the cooked chicken back to the skillet and spoon the sauce over the top. Simmer for 5-10
                                          minutes, until the c
                                      </div>
                                  </div>
                              </li>
                          </ol>
                      </div>
                      <div>
                          <h2 className="text-2xl font-bold">Tips</h2>
                          <div className="mt-4 grid gap-4 text-muted-foreground">
                              <div>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="mr-2 inline-block h-4 w-4"
                                  >
                                      <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                  For best results, use freshl
                              </div>
                              <div>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="mr-2 inline-block h-4 w-4"
                                  >
                                      <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                  Serve the chicken over pasta, r
                              </div>
                              <div>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="mr-2 inline-block h-4 w-4"
                                  >
                                      <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                  Garnish with chopped
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </div>
  )
}

export default Reciepie