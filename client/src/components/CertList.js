import { get } from "@/action"
import { getBlur } from "@/util"
import Image from "next/image"
import Link from "next/link"

async function CertList({ chef, res, mine, path, path2 }) {
    if (mine===false)
    {
        chef = await get(path)
        res = await get(path2)
    }
    if(res.result===undefined ) return <div></div>
    return (
        <div className="mx-auto max-w-[1960px] p-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                <div className="after:content relative col-span-1 row-span-3 flex flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-foreground/10 px-6 pb-16 pt-64 text-center text-foreground shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:pt-0">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <span className="flex max-h-full max-w-full items-center justify-center">
                            <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} src={"/cert.svg"} width={250} height={700} alt="2022 Event Photos" className="transform scale-150" />
                        </span>
                        <span className="absolute left-0 right-0 bottom-0 h-[325px] bg-gradient-to-b from-background/0 via-background to-background"></span>
                    </div>
                    <h1 className=" text-4xl font-bold uppercase tracking-widest">{chef.result[0]['NAME']['FIRST_NAME']} {chef.result[0]['NAME']['LAST_NAME']}</h1>
                    <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest">Certificates</h1>
                    <p className="max-w-[40ch] text-foreground/75 sm:max-w-[32ch]">
                        List of all the certificates of the chef.
                    </p>

                </div>
                {
                    res.result && res.result.map((cert, idx) => {
                        return (
                            <Link key={idx} href={cert['LINK']} className="after:content group relative after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight border rounded-xl border-input m-2 p-5" >
                                <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} src={cert['CERTIFICATE_IMAGE']} width={325} height={500} alt="2022 Event Photos" className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110 m-auto" />
                                <div className="flex items-center justify-center text-md mt-5 text-center break-words transition will-change-auto text-wrap foregroundspace-break-spaces break-inside-auto" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                    {cert['CERTIFICATION']}
                                </div>
                            </Link>
                        )
                    })
                }








            </div>
        </div>
    )
}

export default CertList