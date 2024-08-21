'use client'

import {
    Tabs,
    TabsContent, 
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import NormalOrder from "./NormalOrder"
import ScheduledOrder from "./ScheduledOrder"

export function OrderType({ kid, params }) {
    return (
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="normal">Order</TabsTrigger>
                <TabsTrigger value="schedule">Schedule it!</TabsTrigger>
            </TabsList>
            <TabsContent value="normal">
                <NormalOrder kid={kid} params={params} />
            </TabsContent>
            <TabsContent value="schedule">
                <ScheduledOrder kid={kid} params={params} />
            </TabsContent>
        </Tabs>
    )
}
