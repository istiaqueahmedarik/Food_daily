import SignUp from "@/components/SignUp"
export const dynamic = 'force-static'

export const experimental_ppr = true
function page() {
  return (
      <div>
          <SignUp />    
    </div>
  )
}

export default page