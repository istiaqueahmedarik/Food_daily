import Image from "next/image"
import Link from "next/link"

function CertList({ chef, res }) {
    if(res.result===undefined ) return <div></div>
    return (
        <div className="mx-auto max-w-[1960px] p-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                <div className="after:content relative col-span-1 row-span-3 flex flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:pt-0">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <span className="flex max-h-full max-w-full items-center justify-center">
                            <Image src={"/cert.svg"} width={250} height={700} alt="2022 Event Photos" className="transform scale-150" />
                        </span>
                        <span className="absolute left-0 right-0 bottom-0 h-[325px] bg-gradient-to-b from-black/0 via-black to-black"></span>
                    </div>
                    <h1 className=" text-4xl font-bold uppercase tracking-widest">{chef.result[0]['FIRST_NAME']} {chef.result[0]['LAST_NAME']}</h1>
                    <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest">Certificates</h1>
                    <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
                        List of all the certificates of the chef.
                    </p>

                </div>
                {
                    res.result && res.result.map((cert, idx) => {
                        return (
                            <Link key={idx} href={cert['LINK']} className="after:content group relative after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight border rounded-xl border-[#ffffff21] m-2 p-5" >
                                <Image src={cert['CERTIFICATE_IMAGE']} width={325} height={500} alt="2022 Event Photos" className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110 m-auto" />
                                <div className="flex items-center justify-center text-md mt-5 text-center break-words transition will-change-auto text-wrap whitespace-break-spaces break-inside-auto" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
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