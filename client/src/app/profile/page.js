import { get_with_token, uploadImage } from "@/action"
import Button from "@/components/ui/Button";
import Image from "next/image";
export const runtime = 'edge'

async function page() {
  const res = await get_with_token('jwt/Profile');
  return (
    <div className="grid place-content-center h-screen">
      {
        res.result ? (
          <div className="border border-[#ffffff1c] p-7 rounded-md m-7 flex flex-row w-full justify-around gap-5">
            <div className="m-auto">
              <h1 className="text-[4rem] font-extrabold">{`${res.result[0]['FIRST_NAME']} ${res.result[0]['LAST_NAME']}`}</h1>
              <h2 className="italic font-mono font-extralight">{res.result[0]['EMAIL']}</h2>
              <h2 className="italic font-mono font-extralight">
                {res.result[0]['ADDRESS']}
              </h2>
              <h2 className="italic font-mono font-extralight">
                {`${res.result[0]['CITY_CODE']} ${res.result[0]['MOBILE']}`}
              </h2>
              </div>
            <form action={uploadImage} className="grid place-content-center">
              <label htmlFor="profileImageInput">
                <Image src={res.result[0]['PROFILE_IMAGE']} alt="Food plate" width={600} height={400} className="rounded-full bg-cover cursor-pointer max-w-72 max-h-max" />
              </label>
              <input
                type="file"
                id="profileImageInput"
                name="profileImage"
                style={{ display: 'none' }}
              />
            <Button txt = {"Update Image"} />
            </form>
          </div>
        ) : (
          <h1>{res.error}</h1>
        )
        }
      
    </div>
  )
}

export default page