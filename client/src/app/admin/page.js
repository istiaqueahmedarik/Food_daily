import { get_with_token } from '@/action'
import AdminSummary from '@/components/AdminSummary'
import QAcard from '@/components/QAcard'
import QAcard_ from '@/components/QAcard_'
import { Check, DoorOpen, X } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

async function page() {
    const [qa] = await Promise.all([get_with_token('jwt/getQAofficers')])
    if (qa.error !== undefined) 
        redirect('/profile')
  return (
      <div>
          <AdminSummary />
          <div className="grid gap-8 p-4 md:p-8">
              <div>
                  <div className="rounded-lg border bg-background text-card-foreground shadow-sm border-input" >
                      <div className="flex flex-col space-y-1.5 p-6">
                          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
                              People Applied for QA Officer
                          </h3>
                      </div>
                      <div className="p-6">
                          <div className="relative w-full overflow-auto">
                              <table className="w-full caption-bottom text-sm">
                                  <thead className="[&amp;_tr]:border-b border-input">
                                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-input">
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Name
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Email
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Resume
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Actions
                                          </th>
                                      </tr>
                                  </thead>
                                  <tbody className="[&amp;_tr:last-child]:border-0">
                                      {qa.result.filter(person => person['APPROVED']===0).map((person, idx) => {
                                          return (
                                              <QAcard key={idx} {...person} />

                                          )
                                      })}
                                      
                                    
                                      
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
              <div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm border-input" >
                      <div className="flex flex-col space-y-1.5 p-6 border-input">
                          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Current QA Officers</h3>
                      </div>
                      <div className="p-6">
                          <div className="relative w-full overflow-auto">
                              <table className="w-full caption-bottom text-sm">
                                  <thead className="[&amp;_tr]:border-b border-input">
                                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-input">
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Name
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Email
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Start Date
                                          </th>
                                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                              Actions
                                          </th>
                                      </tr>
                                  </thead>
                                  <tbody className="[&amp;_tr:last-child]:border-0">
                                      {qa.result.filter(person => person['APPROVED'] === 1).map((person, idx) => {
                                          return (
                                              <QAcard_ key={idx} {...person} />

                                          )
                                      })}
                                     
                                     
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default page