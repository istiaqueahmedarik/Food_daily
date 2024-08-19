import { addDish } from "@/action";
import Button from "@/components/ui/Button";
import Image from "next/image";

function layout({ params,children }) {
    const binded = addDish.bind(null, params);

    return (
      <div>
      <div className="grid grid-cols-2">
          <div className="m-auto">
                    <Image  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} src={"/burger.svg"} alt="burger" width={500} height={500} />
          </div>
          <div className="flex flex-col min-h-dvh m-auto">

              <form action={binded} className="flex-1 px-4 md:px-6 py-8">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm max-w-2xl mx-auto border-[#ffffff18]"  >
                      <div className="flex flex-col space-y-1.5 p-6">
                          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Add New Food Item</h3>
                          <p className="text-sm text-muted-foreground">Fill out the form to add a new food to the menu.</p>
                      </div>
                      <div className="p-6 space-y-4">
                          <div className="grid gap-2">
                              <label
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  for="name"
                              >
                                  Food Name
                              </label>
                              <input
                                  className="flex h-10 w-full rounded-md border border-[#ffffff18] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  id="name"
                                  placeholder="Enter food name"
                                  name="foodName"
                              />
                          </div>
                          <div className="grid gap-2">
                              <label
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  for="description"
                              >
                                  Description
                              </label>
                              <textarea
                                  className="flex min-h-[80px] w-full rounded-md border border-[#ffffff18] bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  id="description"
                                  placeholder="Enter food description"
                                  name="foodDescription"
                              ></textarea>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                  <label
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      for="price"
                                  >
                                      Price
                                  </label>
                                  <input
                                      className="flex h-10 w-full rounded-md border border-[#ffffff18] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                      id="price"
                                      placeholder="Enter price"
                                      type="number"
                                      name="foodPrice"
                                  />
                              </div>
                              <div className="grid gap-2">
                                  <label
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      for="image"
                                  >
                                      Image
                                  </label>
                                  <div className="flex items-center gap-2">
                                      <input type="file" name="foodImage" id="image" accept=".jpg,.png,.svg" className="flex h-10 w-full rounded-md border border-[#ffffff18]  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="flex items-center p-6">
                          <Button txt="Add Food Item" />
                      </div>
                  </div>
              </form>
          </div>
            </div>
          {children}
        </div>
  )
}

export default layout

const Icon = () => {
    return (
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
            className="size-6"
        >
            <circle cx="12.5" cy="8.5" r="2.5"></circle>
            <path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z"></path>
            <path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5"></path>
        </svg>
    )
}