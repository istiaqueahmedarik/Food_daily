'use client'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Button3 } from './ui/button3'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Button from './ui/Button'
import { format, startOfToday } from 'date-fns'
import { addCartScheduled } from '@/action'
import { Badge } from './ui/badge'

function ScheduledOrder({ kid, params }) {
    const [date, setDate] = useState([])
    const [scheduledOrders, setScheduledOrders] = useState([]);
    const handleSubmission = async() => {
        console.log(scheduledOrders);
        const data = {
            kid: kid,
            orders: scheduledOrders.map(order => ({
                date: format(order.date, 'yyyy-MM-dd'),
                quantity: order.quantity,
                time: order.time
            })),
            fid: params.fid,
        }
        await addCartScheduled(data);
    }
  return (
      <div>
          <div  className="flex flex-col gap-5">
              <Badge variant={"outline"} className="w-fit text-center text-md m-auto">
                  Schedule your order on specific date/s
             </Badge>
              <Popover>
                  <PopoverTrigger asChild>
                      <Button3
                          variant={"outline"}
                          className={cn(
                              "w-full justify-start text-left font-normal",
                              scheduledOrders.length === 0 && "text-muted-foreground"
                          )}
                      >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledOrders.length > 0
                              ? `${scheduledOrders.length} order${scheduledOrders.length > 1 ? 's' : ''} scheduled`
                              : <span>Schedule an order</span>}
                      </Button3>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                      <Calendar
                          mode="multiple"
                          selected={scheduledOrders.map(order => order.date)}
                          onSelect={(dates) => {
                              setScheduledOrders(dates.map(date => ({
                                  date,
                                  quantity: 1,
                                  time: '00:00'
                              })));
                          }}
                          disabledDates={(date) => date < startOfToday()}
                          initialFocus
                      />
                  </PopoverContent>
              </Popover>
              <div className="flex flex-col gap-5">
                  {scheduledOrders.map((order, index) => (
                      <div key={index} className="flex items-center gap-3">
                          <input
                              type="number"
                              name={`quantity-${index}`}
                              defaultValue={order.quantity}
                              onChange={(e) => {
                                  const updatedOrders = [...scheduledOrders];
                                  updatedOrders[index].quantity = parseInt(e.target.value);
                                  setScheduledOrders(updatedOrders);
                              }}
                              className="w-20 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                          <input
                              type="time"
                              name={`time-${index}`}
                              defaultValue={order.time}
                              onChange={(e) => {
                                  const updatedOrders = [...scheduledOrders];
                                  updatedOrders[index].time = e.target.value;
                                  setScheduledOrders(updatedOrders);
                              }}
                              className="w-32 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                      </div>
                  ))}
              </div>
              <Button3 onClick={handleSubmission}>
                  {`Schedule Order (${scheduledOrders.length} date${scheduledOrders.length > 1 ? 's' : ''})`}
              </Button3>
          </div>
    </div>
  )
}

export default ScheduledOrder