import Login from "@/components/Login"
export const dynamic = 'force-static'
export const runtime = 'edge'

function page() {
  return (
      <div>
          <Login />
    </div>
  )
}

export default page