import { reportAddFood } from "@/action"
import Button from "@/components/ui/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export default async function Page({ params }) {
    const binded = reportAddFood.bind(null, params.fid)
    return (
        <div className="flex flex-wrap place-content-center">
            <div className="m-auto">
                <Image src="/report.svg" alt="report" width={400} height={400} />
            </div>
            <form action={binded} className="m-auto">
                <Card className="w-full max-w-sm ">
                    <CardHeader>
                        <CardTitle className="text-2xl">Report your concern</CardTitle>
                        <CardDescription>
                            Send your concerns to the admin and help us improve our services.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="report">Report</Label>
                            <Textarea id="report" type="report" name="report" placeholder="..." required />
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button />
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
