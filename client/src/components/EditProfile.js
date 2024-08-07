import React from 'react'
import ProfileImage from './ProfileImage'
import { updateProfile } from '@/action'

function EditProfile(props) {
    const adjustedDate = new Date(props.res['DOB']);
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    const formattedDob = adjustedDate.toISOString().split('T')[0];
  return (
      <div className="mx-auto max-w-[800px] space-y-6 py-8">
          <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="text-muted-foreground">Update your personal information.</p>
          </div>
          <div  className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <form action={updateProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              for="firstName"
                          >
                              First Name
                          </label>
                          <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff26]"
                              id="firstName"
                              name='firstName'
                              defaultValue={props.res['FIRST_NAME']}
                          />
                      </div>
                      <div className="space-y-2">
                          <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              for="lastName"
                          >
                              Last Name
                          </label>
                          <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff26]"
                              id="lastName"
                                name='lastName'
                              defaultValue={props.res['LAST_NAME']}
                          />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="dateOfBirth"
                      >
                          Date of Birth
                      </label>
                      <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff26]"
                          id="dateOfBirth"
                          type="date"
                          name='dob'
                          defaultValue={formattedDob}
                      />
                  </div>
                  <div className="space-y-2">
                      <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="address"
                      >
                          Address
                      </label>
                      <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff26]"
                          id="address"
                            name='address'
                      >
                            {props.res['ADDRESS']}
                      </textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              for="mobileNumber"
                          >
                              Mobile Number
                          </label>
                          <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff26]"
                              id="mobileNumber"
                                name='mobileNumber'
                              defaultValue={props.res['MOBILE']}
                          />
                      </div>
                      <div className="space-y-2">
                          <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              for="cityCode"
                          >
                              City Code
                          </label>
                          <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff26]"
                              id="cityCode"
                                name='cityCode'
                              defaultValue={props.res['CITY_CODE']}
                          />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="email"
                      >
                          Email
                      </label>
                      <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff26]"
                          id="email"
                          type="email"
                            name='email'
                          defaultValue={props.res['EMAIL']}
                          contentEditable={false}
                          readOnly
                      />
                  </div>
                  <div className="flex justify-center">
                      <button type='submit' className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 border border-[#ffffff26]">
                          Save Changes
                      </button>
                  </div>
              </form>
              
              <div className="space-y-4">
                  <div className="flex items-center justify-center">
                      <ProfileImage img={props.res['PROFILE_IMAGE']} />
                  </div>
                  
              </div>
           
          </div>
        
      </div>
  )
}

export default EditProfile