'use client'

import Link from 'next/link'
import { Button3 } from "@/components/ui/button3"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export function FoodReportCta({fid}) {
  return (
    (<Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <h2 className="text-xl font-semibold">Report Food Issues</h2>
        </div>
        <p className="mb-4 text-muted-foreground text-sm font-extralight">
          Encountered a food safety problem or had a bad dining experience? Let us know to help keep our community safe and informed.
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          
          <Button3 asChild>
            <Link href={`/chef/kitchen/food/${fid}/report`}>
              Report Now
            </Link>
          </Button3>
        </div>
      </CardContent>
    </Card>)
  );
}