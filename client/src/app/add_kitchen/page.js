import Image from "next/image"

function page() {
  return (
    <div className="m-auto w-full">
      <div className="h-20"></div>
      <div className="justify-center grid grid-cols-2 place-content-center m-auto">
        <div className="rounded-lg bg-[#0e1216] border bg-card text-card-foreground shadow-sm  mx-auto border-[#ffffff1c] " >
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Register Your Beautiful Kitchen!</h3>
            <p className="text-sm text-muted-foreground">Register Your New Kitchen (Image and Approval will be processed later).</p>
          </div>
          <div className="p-6">
            <form className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="name"
                  >
                    Name
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff27]"
                    id="name"
                    name="name"
                    placeholder="Enter kitchen name"
                    maxlength="100"
                    required=""
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="address"
                  >
                    City Name
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff27]"
                    id="city_name"
                    name="city_name"
                    placeholder="Enter City Name"
                    maxlength="100"
                    required=""
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="city-code"
                  >
                    Address
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff27]"
                    id="address"
                    name="address"
                    placeholder="Enter Address"
                    maxlength="100"
                    required=""
                  />
                </div>

              </div>

            </form>
          </div>
          <div className="m-auto w-full flex items-center p-6">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 m-auto border border-[#ffffff27]">
              Register Kitchen
            </button>
          </div>
        </div>
        <Image src="/apply_kitchen.svg" width="700" height="700" alt="Kitchen" className="rounded-lg object-cover" />
     </div>
   </div>
  )
}

export default page