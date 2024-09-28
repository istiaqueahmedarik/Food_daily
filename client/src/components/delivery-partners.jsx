'use client';
import { useState, useEffect } from 'react'
import { Button3 } from "@/components/ui/button3"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { banDelivery, get_with_token, post_with_token, unbanDelivery } from '@/action';

export function DeliveryPartnersComponent() {
  const [partners, setPartners] = useState([])

  useEffect(() => {
    fetchDeliveryPartners()
  }, [])

  const fetchDeliveryPartners = async () => {
    try {
      const data = await get_with_token('jwt/allDeliveryPartner')
      
      setPartners(data)
    } catch (error) {
      console.error('Error fetching delivery partners:', error)
      toast({
        title: "Error",
        description: "Failed to fetch delivery partners. Please try again.",
        variant: "destructive",
      })
    }
  }

  const banPartner = async (id) => {
    try {
      const data = await banDelivery(id)
      toast({
        title: "Success",
        description: "Delivery partner has been banned.",
      })
    } catch (error) {
      console.error('Error banning partner:', error)
      toast({
        title: "Error",
        description: "Failed to ban delivery partner. Please try again.",
        variant: "destructive",
      })
    }
  }

  const unbanPartner = async (id) => {
    try {
      const data = await unbanDelivery(id)
      toast({
        title: "Success",
        description: "Delivery partner has been unbanned.",
      })
    } catch (error) {
      console.error('Error unbanning partner:', error)
      toast({
        title: "Error",
        description: "Failed to unban delivery partner. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    (<div className="container mx-auto py-10 col-span-12 border border-input rounded-md">
      <h1 className="text-2xl font-bold mb-5">Delivery Partners</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.ID}>
              <TableCell>{partner.ID}</TableCell>
              <TableCell>{partner.EMAIL}</TableCell>
              <TableCell>{partner.VERIFIED===1?'True':'False'}</TableCell>
              <TableCell>
                {
                  partner.VERIFIED===1?
                  <Button3 onClick={() => banPartner(partner.ID)} variant="destructive">Ban</Button3>
                    : <Button3 className="bg-primary" onClick={() => unbanPartner(partner.ID)} variant="destructive">Unban</Button3>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>)
  );
}