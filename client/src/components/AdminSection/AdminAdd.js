import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { addAdmin, get_with_token, removeAdmin } from "@/action"
import Button from "../ui/Button"



export default async function AdminAdd() {
    const admins = await get_with_token('jwt/allAdmin')

    
    console.log(admins)
   
    return (
        <div className="mb-5 bg-background p-8">
            <div className="grid grid-cols-12 gap-3 ">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Add New Admin</CardTitle>
                        <CardDescription>Enter the email address of the new admin</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={addAdmin}  className="flex space-x-2">
                            <Input
                                type="email"
                                placeholder="admin@example.com"
                                name="email"
                                className="flex-grow"
                                required
                            />
                            <Button className="w-fit" type="submit">Add Admin</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="col-span-8">
                    <CardHeader>
                        <CardTitle>Current Admins</CardTitle>
                        <CardDescription>List of all current admin users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Date Added</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => {
                                    const binded = removeAdmin.bind(this, admin['EMAIL'])
                                    return(
                                        <TableRow key={admin['ID']}>
                                            <TableCell>{admin.EMAIL}</TableCell>
                                            <TableCell>{new Date(admin.REGISTERED).toLocaleString
                                                ()}</TableCell>
                                            <TableCell className={`${admins.length===1&&'hidden'}`}>
                                                <form action={binded}>
                                                    <Button variant={"ghost"} txt="Remove" />

                                                </form>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}