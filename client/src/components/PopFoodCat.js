import { get } from '@/action'
import React from 'react'
import { Badge } from './ui/badge';

async function PopFoodCat() {
    const res = await get('bestFoodCategory');
    const foodCategories = res.result;
  return (
      <div className="flex flex-wrap justify-center gap-2">
          {foodCategories.map((category, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                  {category['NAME']}
              </Badge>
          ))}
      </div>
  )
}

export default PopFoodCat