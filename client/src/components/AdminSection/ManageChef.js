import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button3 } from '../ui/button3'
import { MoreHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { banChef, get_with_token, unbanChef } from '@/action'
import Button from '../ui/Button'
import Link from 'next/link'

async function ManageChef() {
    const data = await get_with_token('jwt/allChefs');
    const chefs = data.result;
  return (

          <Card className="col-span-6">
              <CardHeader>
                  <CardTitle>Manage Chefs</CardTitle>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Speciality</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead>Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                      {chefs.map((chef) => {
                          const binded1 = banChef.bind(null, chef['ID']);
                          const binded2 = unbanChef.bind(null, chef['ID']);
                          return (
                              <TableRow key={chef['ID']}>
                                  <TableCell className={`${chef['STATUS'] !== 'ACTIVE' && 'text-red-500'}`}>{chef['NAME']}</TableCell>
                                  <TableCell>{chef['SPECIALITY']}</TableCell>
                                  <TableCell>{chef['RATING']}</TableCell>
                                  <TableCell>
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button3 variant="ghost" className="h-8 w-8 p-0">
                                                  <MoreHorizontal className="h-4 w-4" />
                                              </Button3>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                              <DropdownMenuItem>
                                                  <Link href={`/chef/${chef['ID']}`}>
                                                      View Details
                                                    </Link>
                                              </DropdownMenuItem>
                                              
                                              <DropdownMenuSeparator />
                                              {chef['STATUS'] === 'ACTIVE' ? <DropdownMenuItem className="text-red-600">
                                                  <Dialog>
                                                      <DialogTrigger asChild>
                                                          <form action={binded1} className='w-full m-auto'>
                                                              <Button variant="ghost" className="p-0 hover:bg-transparent" txt='Ban' />
                                                          </form>

                                                      </DialogTrigger>

                                                  </Dialog>
                                              </DropdownMenuItem> : <DropdownMenuItem className="text-red-600">
                                                  <Dialog>
                                                      <DialogTrigger asChild>
                                                          <form action={binded2} className='w-full m-auto'>
                                                              <Button variant="ghost" className="p-0 hover:bg-transparent" txt='Unban' />
                                                          </form>

                                                      </DialogTrigger>

                                                  </Dialog>
                                              </DropdownMenuItem>}
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                  </TableCell>
                              </TableRow>
                      )})}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>

        



  )
}

export default ManageChef