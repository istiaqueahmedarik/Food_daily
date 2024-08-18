"use client"
import { useState } from 'react'
import { StarIcon } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button3 } from './ui/button3'

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
                <span className="font-semibold">{review.author}</span>
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                    ))}
                </div>
            </div>
            <p className="text-sm">{review.content}</p>
        </div>
    )
}

export default function Rating() {
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        
        setRating(0)
        setReview('')
    }

    return (
        <Card className="w-full lg:max-w-7xl md:max-w-6xl sm:max-w-5xl mx-auto mb-5">
            <CardHeader>
                <CardTitle>Rate This Food</CardTitle>
                <CardDescription>How was your experience related to this food?</CardDescription>
            </CardHeader>
            <div className="flex flex-col md:flex-row">
                <form onSubmit={handleSubmit} className="w-full md:w-1/2 p-6 md:border-r">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="rating" className="block text-sm font-medium text-muted-foreground">
                                Star Rating
                            </label>
                            <div className="flex space-x-1" id="rating" aria-label={`Star rating, ${rating} out of 5 stars selected`}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`text-2xl focus:outline-none focus:ring-2 focus:ring-input rounded-full ${star <= rating ? 'text-primary' : 'text-muted'
                                            }`}
                                        onClick={() => setRating(star)}
                                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                                        aria-pressed={star <= rating}
                                    >
                                        <StarIcon className="w-8 h-8 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="review" className="block text-sm font-medium text-muted-foreground">
                                Your Review
                            </label>
                            <Textarea
                                id="review"
                                placeholder="Tell us about your experience..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button3 type="submit" className="w-full">
                            Submit Review
                        </Button3>
                    </CardFooter>
                </form>
                <div className="w-full md:w-1/2 p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
                    <ScrollArea className="h-[300px] pr-4">
                        {mockReviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </Card>
    )
}