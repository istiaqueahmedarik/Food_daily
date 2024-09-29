import { get_with_token } from "@/action"
import { getImage } from "@/util"
import { PencilIcon, MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button3 } from "./ui/button3"

async function Personal({ mine = true, path, res }) {
    if (mine === false) {
        res = await get_with_token(path)
    }
    const image = await getImage()
    

    if (!res.result) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <h1 className="text-2xl text-destructive">{res.error}</h1>
            </div>
        )
    }

    const { FIRST_NAME, LAST_NAME } = res.result[0].NAME
    const { EMAIL, ADDRESS, CITY_CODE, MOBILE, PROFILE_IMAGE } = res.result[0]

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl overflow-hidden">
                <div className="relative h-64">
                    <div className="absolute inset-0 bg-gradient-to-r from-ring to-secondary opacity-90" />
                    <Image
                        src={PROFILE_IMAGE}
                        alt="Profile background"
                        className="mix-blend-overlay"
                        fill
                    />
                </div>
                <CardContent className="relative px-8 py-10 -mt-32">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <Image
                                src={PROFILE_IMAGE}
                                alt={`${FIRST_NAME} ${LAST_NAME}`}
                                width={200}
                                height={200}
                                className="rounded-full border-4 border-background object-cover aspect-square"
                            />
                            {mine && (
                                <Link href="/profile/edit" passHref>
                                    <Button3
                                        size="icon"
                                        variant="secondary"
                                        className="absolute bottom-0 right-0 rounded-full shadow-md"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Button3>
                                </Link>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">
                                {FIRST_NAME} {LAST_NAME}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-4">{EMAIL}</p>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-foreground">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span>{ADDRESS}, {CITY_CODE}</span>
                                </div>
                                <div className="flex items-center gap-2 text-foreground">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <span>{MOBILE}</span>
                                </div>
                                <div className="flex items-center gap-2 text-foreground">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <span>{EMAIL}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Personal