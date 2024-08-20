'use client'
const prevState = {
    message: '',
    kid: '',
}
import { add_kitchen, editKitchen } from "@/action";
import { useFormState } from "react-dom"

function ApplyKitchen({ edit = false, kid, header = "Register Your Beautiful Kitchen!", subheader = "Register Your New Kitchen (Image and Approval will be processed later).", data = {
    KICHEN_NAME: "",
    KITCHEN_CITY_NAME: "",
    KITCHEN_ADDRESS: "",
    kitchen_id: ""
}, button = "Register Kitchen" }) {
    let [state, formAction] = useFormState(add_kitchen, prevState);
    if (edit) {
        prevState.kid = kid;
        [state, formAction] = useFormState(editKitchen, prevState);
        button = "Update Kitchen"
        header = "Update Your Beautiful Kitchen!"
        subheader = "Update Your Kitchen (Image and Approval will be processed later)."
    }
    
    

  return (
      <div className="rounded-lg bg-[#0e1216] border bg-card text-card-foreground shadow-sm  mx-auto border-[#ffffff1c] " >
          <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">{header}</h3>
              <p className="text-sm text-muted-foreground">{subheader}</p>
          </div>
          <div className="p-5">
              <form action={formAction} className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                          <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              for="name"
                          >
                              Name
                          </label>
                          <input
                              className="flex bg-background h-10 w-full rounded-md border border-input  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 "
                              id="name"
                              name="KICHEN_NAME"
                              defaultValue={data['KICHEN_NAME']}
                              placeholder="Enter kitchen name"
                              maxlength="100"
                              required
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
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              id="city_name"
                              name="KITCHEN_CITY_NAME"
                                defaultValue={data['KITCHEN_CITY_NAME']}
                              placeholder="Enter City Name"
                              maxlength="100"
                              required
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
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              id="address"
                              name="KITCHEN_ADDRESS"
                                defaultValue={data['KITCHEN_ADDRESS']}
                              placeholder="Enter Address"
                              maxlength="100"
                              required
                          />
                      </div>

                  </div>
                  <div className="m-auto w-full flex items-center p-6">
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 m-auto border border-input">
                         {button}
                      </button>
                  </div>
                  <p className="text-red-500">
                        {state.message}
                  </p>
              </form>
          </div>
         
      </div>
  )
}

export default ApplyKitchen