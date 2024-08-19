import { get_with_token } from "@/action";
import { getImage } from "@/util";
import { PencilIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

async function Personal({ mine = true, path, res }) {
    if(mine===false)
        res = await get_with_token(path);
    const image = await getImage();
  return (
      <div>
          {
              res.result ? (
                  <div className="border border-[#ffffff1c] bg-[#0e1216] p-9 rounded-md m-8 flex flex-row w-full justify-around gap-5">
                      <div className="relative group m-auto">
                          <h1 className="text-[4rem] font-extrabold text-foreground">{`${res.result[0]['FIRST_NAME']} ${res.result[0]['LAST_NAME']}`}</h1>
                          <h2 className="italic font-mono  text-[#727A83] font-medium">{res.result[0]['EMAIL']}</h2>
                          <h2 className="italic font-mono text-[#727A83] font-medium">
                              {res.result[0]['ADDRESS']}
                          </h2>
                          <h2 className="italic font-mono text-[#727A83] font-medium">
                              {`${res.result[0]['CITY_CODE']} ${res.result[0]['MOBILE']}`}
                          </h2>
                          {mine ? (
                              <Link href="/profile/edit">
                                  <PencilIcon className="dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-0 right-0" />
                              </Link>
                          ) : null}
                          
                      </div>
                      <div className="grid place-content-center">
                          <Image blurDataURL={image} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} src={res.result[0]['PROFILE_IMAGE']} alt="Food plate" width={600} height={400} className="rounded-full bg-cover max-w-72 max-h-max" />


                      </div>
                  </div>
              ) : (
                  <h1>{res.error}</h1>
              )
          }
    </div>
  )
}

export default Personal