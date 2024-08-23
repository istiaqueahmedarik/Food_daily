import { StarIcon } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button3 } from './ui/button3'
import { reviewFood } from '@/action'
import RatingWrite from './RatingWrite'
import { Suspense } from 'react'
import Link from 'next/link'

const mockReviews = [
    { id: 1, author: 'Alice', rating: 5, content: 'Excellent service and delicious food!' },
    { id: 2, author: 'Bob', rating: 4, content: 'Great experience overall, but delivery was a bit late.' },
    { id: 3, author: 'Charlie', rating: 5, content: 'The best pizza I\'ve had in years!' },
    { id: 4, author: 'Diana', rating: 3, content: 'Food was okay, but not exceptional.' },
    { id: 5, author: 'Eve', rating: 5, content: 'Impressed with the quality and speed of delivery.' },
]

function ReviewCard({ review }) {
    
    return (
        <div className="mb-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{review['FIRST_NAME']}</span>
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`w-4 h-4 ${i < review['RATING'] ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                    ))}
                </div>
            </div>
            <p className="text-sm">{review['REVIEW']}</p>
        </div>
    )
}

export default async function Rating(props) {
    

    return (
        <Card className="w-full lg:max-w-7xl md:max-w-6xl sm:max-w-5xl mx-auto mb-5">
            <CardHeader>
                <CardTitle>Rate This Food or <Link href={`/chef/kitchen/food/${props.fid}/report`}>Report?</Link></CardTitle>
                <CardDescription>How was your experience related to this food?</CardDescription>
            </CardHeader>
            <div className="flex flex-col md:flex-row">
                {props.status ?
                    <Suspense fallback={<div>loading...</div>}>
                        <RatingWrite data={props.data.result} fid={props.fid} />
                    </Suspense>
                    : <div className='p-5 my-auto'>
                        <p>
                            You need to be logged in or buy this food to leave a review.
                        </p>
                    </div>}
                <div className="w-full md:w-1/2 p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
                    <ScrollArea className="h-[300px] pr-4">
                        {props.data.result.map(review => (
                            <ReviewCard key={review['ID']} review={review} />
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </Card>
    )
}