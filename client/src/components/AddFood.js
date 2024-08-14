import { get } from '@/action'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
// import AddFoodCard from './ui/AddFoodCard';

async function AddFood({ id }) {
    const data = await get(`getCategories/${id}`);
    
    return (
        <div className='m-5'>
            <h1 className='text-3xl text-center font-bold'>Add Food</h1>
           
        </div>
    )
}

export default AddFood