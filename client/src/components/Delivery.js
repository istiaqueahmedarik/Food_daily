import React from 'react'

function Delivery() {
  return (
      <div class="flex min-h-screen w-full flex-col bg-background">

          <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
              <div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                  <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                      <div
                          class="rounded-lg border bg-card text-card-foreground shadow-sm sm:col-span-2"
                          x-chunk="dashboard-05-chunk-0"
                          data-v0-t="card"
                      >
                          <div class="flex flex-col space-y-1.5 p-6 pb-3">
                              <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Current Deliveries</h3>
                              <p class="text-sm text-muted-foreground max-w-lg text-balance leading-relaxed">
                                  View and manage your active deliveries on the map.
                              </p>
                          </div>
                          <div class="p-6">
                              <div class="aspect-[4/3] w-full rounded-lg bg-muted"></div>
                          </div>
                      </div>
                      <div
                          class="rounded-lg border bg-card text-card-foreground shadow-sm"
                          x-chunk="dashboard-05-chunk-1"
                          data-v0-t="card"
                      >
                          <div class="flex flex-col space-y-1.5 p-6 pb-2">
                              <p class="text-sm text-muted-foreground">Active Orders</p>
                              <h3 class="whitespace-nowrap font-semibold tracking-tight text-4xl">12</h3>
                          </div>
                          <div class="p-6">
                              <div class="text-xs text-muted-foreground">+3 since last hour</div>
                          </div>
                          <div class="flex items-center p-6">
                              <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                  View Orders
                              </button>
                          </div>
                      </div>
                      <div
                          class="rounded-lg border bg-card text-card-foreground shadow-sm"
                          x-chunk="dashboard-05-chunk-2"
                          data-v0-t="card"
                      >
                          <div class="flex flex-col space-y-1.5 p-6 pb-2">
                              <p class="text-sm text-muted-foreground">Completed Deliveries</p>
                              <h3 class="whitespace-nowrap font-semibold tracking-tight text-4xl">128</h3>
                          </div>
                          <div class="p-6">
                              <div class="text-xs text-muted-foreground">+10% from last month</div>
                          </div>
                          <div class="flex items-center p-6">
                              <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                  View History
                              </button>
                          </div>
                      </div>
                  </div>
                  <div
                      class="rounded-lg border bg-card text-card-foreground shadow-sm"
                      x-chunk="dashboard-05-chunk-3"
                      data-v0-t="card"
                  >
                      <div class="flex flex-col space-y-1.5 p-6 px-7">
                          <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Active Orders</h3>
                          <p class="text-sm text-muted-foreground">Manage your current deliveries.</p>
                      </div>
                      <div class="p-6">
                          <div class="relative w-full overflow-auto">
                              <table class="w-full caption-bottom text-sm">
                                  <thead class="[&amp;_tr]:border-b">
                                      <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Order
                                          </th>
                                          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">
                                              Customer
                                          </th>
                                          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">
                                              Address
                                          </th>
                                          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                              Pickup
                                          </th>
                                          <th class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right">
                                              Actions
                                          </th>
                                      </tr>
                                  </thead>
                                  <tbody class="[&amp;_tr:last-child]:border-0">
                                      <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-accent">
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                                              <div class="font-medium">#1234</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">
                                              <div class="font-medium">Liam Johnson</div>
                                              <div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">
                                              <div>123 Main St, Anytown USA</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                              <div>12:30 PM</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">
                                              <button class="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 h-7 gap-1 text-sm">
                                                  <span class="sr-only sm:not-sr-only">Deliver</span>
                                              </button>
                                              <button class="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 h-7 gap-1 text-sm">
                                                  <span class="sr-only sm:not-sr-only">View</span>
                                              </button>
                                          </td>
                                      </tr>
                                      <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                                              <div class="font-medium">#2345</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">
                                              <div class="font-medium">Olivia Smith</div>
                                              <div class="hidden text-sm text-muted-foreground md:inline">olivia@example.com</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">
                                              <div>456 Oak St, Anytown USA</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                              <div>1:15 PM</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">
                                              <button class="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 h-7 gap-1 text-sm">
                                                  <span class="sr-only sm:not-sr-only">Deliver</span>
                                              </button>
                                              <button class="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 h-7 gap-1 text-sm">
                                                  <span class="sr-only sm:not-sr-only">View</span>
                                              </button>
                                          </td>
                                      </tr>
                                      <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                                              <div class="font-medium">#3456</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">
                                              <div class="font-medium">Noah Williams</div>
                                              <div class="hidden text-sm text-muted-foreground md:inline">noah@example.com</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">
                                              <div>789 Elm St, Anytown USA</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                              <div>2:45 PM</div>
                                          </td>
                                          <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">
                                              <button class="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 h-7 gap-1 text-sm">
                                                  <span class="sr-only sm:not-sr-only">Deliver</span>
                                              </button>
                                              <button class="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 h-7 gap-1 text-sm">
                                                  <span class="sr-only sm:not-sr-only">View</span>
                                              </button>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
              <div>
                  <div
                      class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
                      x-chunk="dashboard-05-chunk-4"
                      data-v0-t="card"
                  >
                      <div class="space-y-1.5 p-6 flex flex-row items-start bg-muted/50">
                          <div class="grid gap-0.5">
                              <h3 class="whitespace-nowrap font-semibold tracking-tight group flex items-center gap-2 text-lg">
                                  Order #1234
                                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100">
                                      <span class="sr-only">Copy Order ID</span>
                                  </button>
                              </h3>
                              <p class="text-sm text-muted-foreground">Pickup: 12:30 PM</p>
                          </div>
                          <div class="ml-auto flex items-center gap-1">
                              <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 h-8 gap-1">
                                  <span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">Deliver</span>
                              </button>
                          </div>
                      </div>
                      <div class="p-6 text-sm">
                          <div class="grid gap-3">
                              <div class="font-semibold">Order Details</div>
                              <ul class="grid gap-3">
                                  <li class="flex items-center justify-between">
                                      <span class="text-muted-foreground">
                                          Burger x <span>1</span>
                                      </span>
                                      <span>$12.99</span>
                                  </li>
                                  <li class="flex items-center justify-between">
                                      <span class="text-muted-foreground">
                                          Fries x <span>1</span>
                                      </span>
                                      <span>$4.99</span>
                                  </li>
                                  <li class="flex items-center justify-between">
                                      <span class="text-muted-foreground">
                                          Drink x <span>1</span>
                                      </span>
                                      <span>$2.99</span>
                                  </li>
                              </ul>
                              <div data-orientation="horizontal" role="none" class="shrink-0 bg-border h-[1px] w-full my-2"></div>
                              <ul class="grid gap-3">
                                  <li class="flex items-center justify-between">
                                      <span class="text-muted-foreground">Subtotal</span>
                                      <span>$20.97</span>
                                  </li>
                                  <li class="flex items-center justify-between">
                                      <span class="text-muted-foreground">Delivery Fee</span>
                                      <span>$3.00</span>
                                  </li>
                                  <li class="flex items-center justify-between font-semibold">
                                      <span class="text-muted-foreground">Total</span>
                                      <span>$23.97</span>
                                  </li>
                              </ul>
                          </div>
                          <div data-orientation="horizontal" role="none" class="shrink-0 bg-border h-[1px] w-full my-4"></div>
                          <div class="grid grid-cols-2 gap-4">
                              <div class="grid gap-3">
                                  <div class="font-semibold">Customer Information</div>
                                  <div class="grid gap-0.5 not-italic text-muted-foreground">
                                      <div class="font-medium">Liam Johnson</div>
                                      <div>123 Main St, Anytown USA</div>
                                      <div>
                                          <a href="#">+1 (234) 567-890</a>
                                      </div>
                                  </div>
                              </div>
                              <div class="grid auto-rows-max gap-3">
                                  <div class="font-semibold">Delivery Instructions</div>
                                  <div class="text-muted-foreground">Leave the order at the front door.</div>
                              </div>
                          </div>
                      </div>
                      <div class="p-6 flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                          <div class="text-xs text-muted-foreground">
                              Pickup: <time datetime="2023-11-23">12:30 PM</time>
                          </div>
                          <nav aria-label="pagination" class="mx-auto flex justify-center ml-auto mr-0 w-auto" role="navigation">
                              <ul class="flex flex-row items-center gap-1"></ul>
                          </nav>
                      </div>
                  </div>
              </div>
          </main>
      </div>
  )
}

export default Delivery