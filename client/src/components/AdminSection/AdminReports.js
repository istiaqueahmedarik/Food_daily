import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button3 } from '../ui/button3'
import { MoreHorizontal } from 'lucide-react'
import { investigateIssue, resolvedIssue } from '@/action'

function AdminReports({data}) {
   
  return (
      <div className="grid grid-cols-12 gap-6 m-5">
          <Card className="col-span-12">
              <CardHeader>
                  <CardTitle>User Reports</CardTitle>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Issue</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {data.map((report) => {
                              const binded1 = investigateIssue.bind(null, report['REPORT_FOOD_ID']);
                              const binded2 = resolvedIssue.bind(null, report['REPORT_FOOD_ID']);
                              return (
                                  <TableRow key={report['ID']}>
                                      <TableCell>{report['FIRST_NAME']}</TableCell>
                                      <TableCell>{report['REASON']}</TableCell>
                                      <TableCell>{report['STATUS']}</TableCell>
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
                                                      <form action={binded1}>
                                                          <button type="submit">Mark as Under Investigation</button>
                                                      </form>
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem>
                                                      <form action={binded2}>
                                                          <button type="submit">Mark as Resolved</button>
                                                      </form>
                                                  </DropdownMenuItem>
                                                  <DropdownMenuSeparator />
                                                  <DropdownMenuItem>
                                                  
                                                      <a href={`mailto:${report['EMAIL']}`}>Contact User</a>
                                                  

                                                  </DropdownMenuItem>
                                              </DropdownMenuContent>
                                          </DropdownMenu>
                                      </TableCell>
                                  </TableRow>
                          )})}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
        </div>
  )
}

export default AdminReports