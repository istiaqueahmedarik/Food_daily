'use client'
import Image from "next/image"
import Link from "next/link"
import NavBar from "./NavBar"
import Button from "./ui/Button"
import { login } from "@/action"
import { useFormState } from "react-dom"
import { getBlur } from "@/util"
import Loginsvg from "./ui/svg/Loginsvg"
const prevState = {
    message: ''
}
function Login() {
    const [state, formAction] = useFormState(login, prevState);
  return (
      <div className="">
          {/* <NavBar vis={true} /> */}
          <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
              <div className="flex items-center justify-center py-12  border-r-2 border-r-foreground">
                  <div className="mx-auto grid w-[350px] gap-6">
                      <div className="grid gap-2 text-center">
                          <h1 className="text-3xl font-bold">Login</h1>
                          <p className="text-balance text-muted-foreground">
                              Enter your email below to login to your account
                          </p>
                      </div>
                      <form action={formAction} className="grid gap-4">
                          <div className="grid gap-2">
                              <label htmlFor="email">Email</label>
                              <input
                                  id="email"
                                  type="email"
                                  name="email"
                                  placeholder="m@example.com"
                                  autoComplete="off"
                                  required
                                  className="w-full py-3 px-4 pr-12 rounded-md border-[0.5px] border-input bg-background text-foreground focus:outline-muted-foreground outline-none"
                              />
                          </div>
                          <div className="grid gap-2">
                              <div className="flex items-center">
                                  <label htmlFor="password">Password</label>
                                  <Link
                                      href="/forgot-password"
                                      className="ml-auto inline-block text-sm underline"
                                  >
                                      Forgot your password?
                                  </Link>
                              </div>
                              <input id="password" type="password" required
                                  className="w-full py-3 px-4 pr-12 rounded-md border-[0.5px] border-input bg-background text-foreground focus:outline-muted-foreground outline-none"
                                    name="password"
                              />
                          </div>
                          <Button />
                          {state.message && (
                                <div className="text-red-500 text-center">{state.message}</div>
                          )}
                         
                      </form>
                      <div className="mt-4 text-center text-sm">
                          Don&apos;t have an account?{" "}
                          <Link href="/signup" className="underline">
                              Sign up
                          </Link>
                      </div>
                  </div>
              </div>
              <div className="bg-background lg:block w-full grid place-content-center">
                  {/* <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60}
                      src="/login.svg"
                      alt="Image"
                      width="1920"
                      height="1080"
                      className="h-full w-96 m-auto  "
                  /> */}
                  <Loginsvg  className=""/>
              </div>
          </div>
      </div>
  )
}

export default Login