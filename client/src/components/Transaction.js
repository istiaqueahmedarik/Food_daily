import React from 'react'

function Transaction() {
  return (
      <div>
          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto p-6 md:p-10">
              <div class="grid gap-6">
                  <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                      <div class="flex flex-col space-y-1.5 p-6">
                          <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Order Summary</h3>
                      </div>
                      <div class="p-6">
                          <div class="grid gap-4">
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div>
                                      <h3 class="font-medium">Chicken Teriyaki Bowl</h3>
                                      <p class="text-muted-foreground">1 x $12.99</p>
                                  </div>
                                  <div class="text-right">$12.99</div>
                              </div>
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div>
                                      <h3 class="font-medium">Vegetable Spring Rolls</h3>
                                      <p class="text-muted-foreground">2 x $4.99</p>
                                  </div>
                                  <div class="text-right">$9.98</div>
                              </div>
                              <div data-orientation="horizontal" role="none" class="shrink-0 bg-border h-[1px] w-full"></div>
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div class="font-medium">Subtotal</div>
                                  <div class="text-right">$22.97</div>
                              </div>
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div class="font-medium">Delivery Fee</div>
                                  <div class="text-right">$3.99</div>
                              </div>
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div class="font-medium">Tax</div>
                                  <div class="text-right">$2.01</div>
                              </div>
                              <div data-orientation="horizontal" role="none" class="shrink-0 bg-border h-[1px] w-full"></div>
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div class="font-medium text-lg">Total</div>
                                  <div class="text-right text-lg font-medium">$28.97</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                      <div class="flex flex-col space-y-1.5 p-6">
                          <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Delivery Address</h3>
                      </div>
                      <div class="p-6">
                          <div class="grid gap-2">
                              <div>
                                  <p class="font-medium">John Doe</p>
                                  <p class="text-muted-foreground">123 Main St, Anytown USA</p>
                              </div>
                              <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                  Change Address
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="grid gap-6">
                  <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                      <div class="flex flex-col space-y-1.5 p-6">
                          <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Payment</h3>
                      </div>
                      <div class="p-6">
                          <form class="grid gap-4">
                              <div class="grid gap-2">
                                  <label
                                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      for="card-number"
                                  >
                                      Card Number
                                  </label>
                                  <input
                                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                      id="card-number"
                                      placeholder="0000 0000 0000 0000"
                                  />
                              </div>
                              <div class="grid grid-cols-3 gap-4">
                                  <div class="grid gap-2">
                                      <label
                                          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          for="expiry-date"
                                      >
                                          Expiry Date
                                      </label>
                                      <input
                                          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                          id="expiry-date"
                                          placeholder="MM/YY"
                                      />
                                  </div>
                                  <div class="grid gap-2">
                                      <label
                                          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          for="cvc"
                                      >
                                          CVC
                                      </label>
                                      <input
                                          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                          id="cvc"
                                          placeholder="123"
                                      />
                                  </div>
                                  <div class="grid gap-2">
                                      <label
                                          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          for="zip-code"
                                      >
                                          Zip Code
                                      </label>
                                      <input
                                          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                          id="zip-code"
                                          placeholder="12345"
                                      />
                                  </div>
                              </div>
                              <div class="grid gap-2">
                                  <label
                                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      for="name-on-card"
                                  >
                                      Name on Card
                                  </label>
                                  <input
                                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                      id="name-on-card"
                                      placeholder="John Doe"
                                  />
                              </div>
                          </form>
                      </div>
                  </div>
                  <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                      <div class="flex flex-col space-y-1.5 p-6">
                          <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Review Order</h3>
                      </div>
                      <div class="p-6">
                          <div class="grid gap-4">
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div>
                                      <h3 class="font-medium">Chicken Teriyaki Bowl</h3>
                                      <p class="text-muted-foreground">1 x $12.99</p>
                                  </div>
                                  <div class="text-right">$12.99</div>
                              </div>
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div>
                                      <h3 class="font-medium">Vegetable Spring Rolls</h3>
                                      <p class="text-muted-foreground">2 x $4.99</p>
                                  </div>
                                  <div class="text-right">$9.98</div>
                              </div>
                              <div data-orientation="horizontal" role="none" class="shrink-0 bg-border h-[1px] w-full"></div>
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div class="font-medium">Subtotal</div>
                                  <div class="text-right">$22.97</div>
                              </div>
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div class="font-medium">Delivery Fee</div>
                                  <div class="text-right">$3.99</div>
                              </div>
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                                  <div class="font-medium">Tax</div>
                                  <div class="text-right">$2.01</div>
                              </div>
                              <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                  Proceed
                              </button>
                              <div data-orientation="horizontal" role="none" class="shrink-0 bg-border h-[1px] w-full"></div>
                              <div class="grid grid-cols-[1fr_auto] items-center gap-4"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default Transaction