"use client"

import React, { useState } from 'react'
import { CardContent, CardFooter } from './ui/card'
import { reviewFood } from '@/action'
import { StarIcon } from 'lucide-react'
import { Textarea } from './ui/textarea'
import { Button3 } from './ui/button3'

function RatingWrite(props) {
    
    const [rating, setRating] = useState(props.data && props.data.length?props.data[0]['RATING']:0)
    const [review, setReview] = useState(props.data && props.data.length ? props.data[0]['REVIEW'] : '')

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        
        const res = await reviewFood({ food_id:props.fid, rating, review })
    }
  return (
      <div className="w-full md:w-1/2 p-6 md:border-r">
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
              <Button3 onClick={handleSubmit} type="submit" className="w-full">
                  Submit Review
              </Button3>
          </CardFooter>
      </div>
  )
}

export default RatingWrite