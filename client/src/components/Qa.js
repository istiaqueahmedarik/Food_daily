import React from 'react'

function Qa() {
  return (

      <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                      <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
                          <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">Total Orders</h3>
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
                              className="w-4 h-4 text-muted-foreground"
                          >
                              <path d="m7.5 4.27 9 5.15"></path>
                              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                              <path d="m3.3 7 8.7 5 8.7-5"></path>
                              <path d="M12 22V12"></path>
                          </svg>
                      </div>
                      <div className="p-6">
                          <div className="text-2xl font-bold">12,345</div>
                          <p className="text-xs text-muted-foreground">+5% from last month</p>
                      </div>
                  </div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
                      <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
                          <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">On-Time Deliveries</h3>
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
                              className="w-4 h-4 text-muted-foreground"
                          >
                              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                              <path d="M15 18H9"></path>
                              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                              <circle cx="17" cy="18" r="2"></circle>
                              <circle cx="7" cy="18" r="2"></circle>
                          </svg>
                      </div>
                      <div className="p-6">
                          <div className="text-2xl font-bold">92%</div>
                          <p className="text-xs text-muted-foreground">+3% from last month</p>
                      </div>
                  </div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
                      <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
                          <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">Customer Satisfaction</h3>
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
                              className="w-4 h-4 text-muted-foreground"
                          >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                      </div>
                      <div className="p-6">
                          <div className="text-2xl font-bold">4.8/5</div>
                          <p className="text-xs text-muted-foreground">+0.2 from last month</p>
                      </div>
                  </div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
                      <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
                          <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">Issues Reported</h3>
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
                              className="w-4 h-4 text-muted-foreground"
                          >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" x2="12" y1="8" y2="12"></line>
                              <line x1="12" x2="12.01" y1="16" y2="16"></line>
                          </svg>
                      </div>
                      <div className="p-6">
                          <div className="text-2xl font-bold">78</div>
                          <p className="text-xs text-muted-foreground">-12% from last month</p>
                      </div>
                  </div>
              </div>
              <div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
                      <div className="flex flex-col space-y-1.5 p-6 px-7">
                          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Recent Orders</h3>
                          <p className="text-sm text-muted-foreground">View and manage recent orders.</p>
                      </div>
                      <div className="p-6">
                          <div className="relative w-full overflow-auto">
                              <table className="w-full caption-bottom text-sm">
                                  <thead className="[&amp;_tr]:border-b">
                                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Order ID
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Customer
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Status
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Issues
                                          </th>
                                          <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right">
                                              Actions
                                          </th>
                                      </tr>
                                  </thead>
                                  <tbody className="[&amp;_tr:last-child]:border-0">
                                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">OD123456</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">John Doe</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                                              <div
                                                  className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                                                  data-v0-t="badge"
                                              >
                                                  Delivered
                                              </div>
                                          </td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">None</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"></td>
                                      </tr>
                                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">OD654321</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Jane Smith</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                                              <div
                                                  className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                  data-v0-t="badge"
                                              >
                                                  Pending
                                              </div>
                                          </td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Missing item</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"></td>
                                      </tr>
                                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">OD789012</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Michael Johnson</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                                              <div
                                                  className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                                                  data-v0-t="badge"
                                              >
                                                  Delivered
                                              </div>
                                          </td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Incorrect order</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"></td>
                                      </tr>
                                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">OD345678</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Emily Davis</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                                              <div
                                                  className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                                                  data-v0-t="badge"
                                              >
                                                  Delivered
                                              </div>
                                          </td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">None</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"></td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                      <div className="flex items-center p-6">
                          <div className="text-xs text-muted-foreground">
                              Showing <strong>1-10</strong> of <strong>32</strong>orders
                          </div>
                      </div>
                  </div>
              </div>
              <div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
                      <div className="flex flex-col space-y-1.5 p-6 px-7">
                          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Customer Feedback</h3>
                          <p className="text-sm text-muted-foreground">View and manage customer feedback.</p>
                      </div>
                      <div className="p-6">
                          <div className="relative w-full overflow-auto">
                              <table className="w-full caption-bottom text-sm">
                                  <thead className="[&amp;_tr]:border-b">
                                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Customer
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Feedback
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Rating
                                          </th>
                                          <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right">
                                              Actions
                                          </th>
                                      </tr>
                                  </thead>
                                  <tbody className="[&amp;_tr:last-child]:border-0">
                                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">John Doe</td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                                              The delivery was fast and the food was delicious. Great experience!
                                          </td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                                              <div className="flex items-center gap-0.5">
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
                                                      className="w-4 h-4 fill-primary"
                                                  >
                                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                  </svg>
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
                                                      className="w-4 h-4 fill-primary"
                                                  >
                                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                  </svg>
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
                                                      className="w-4 h-4 fill-primary"
                                                  >
                                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                  </svg>
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
                                                      className="w-4 h-4 fill-primary"
                                                  >
                                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                  </svg>
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
                                                      className="w-4 h-4 fill-muted stroke-muted-foreground"
                                                  >
                                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                  </svg>
                                              </div>
                                          </td>
                                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"></td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          </main>
      </div>
  )
}

export default Qa