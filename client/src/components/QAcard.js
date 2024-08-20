'use client'
import { Check, DoorOpen, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Button2 from './ui/Button2'

function QAcard(person) {
  return (
      <tr key={person['ID']} className="border-b transition-colors border-input  hover:bg-muted/50 data-[state=selected]:bg-muted">
          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">{person['FIRST_NAME']} {person['LAST_NAME']}</td>
          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">{person['EMAIL']}</td>
          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Link className="text-primary rounded-full border border-input px-4 py-2" href={person['CV_LINK']}>
                  View Resume
              </Link>
          </td>
          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <div className="flex gap-2">
                  {person['APPROVED'] === 1 ? <Button2 icon={<DoorOpen size={16}  color='red'/>
} st={2} id={person['ID']} />
 : <>
                      <Button2 icon={<Check size={16} color='green' />} st={1} id={person['ID']} />

                          <Button2 icon={<X size={16} color='red' st={2} />} st={2} id={person['ID']} url={person['CV_LINK']}/>
                  </>}
               
              </div>
          </td>
      </tr>
  )
}

export default QAcard