'use server'
import { getImage } from '@/util';
import Image from 'next/image'
import React from 'react'
import { Input } from './ui/input';
import { Button3 } from './ui/button3';
import { put } from '@vercel/blob';
import { post_with_token } from '@/action';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function SmallFood({ res }) {
    const blurImg = await getImage();
   
    async function updateFood(formData) {
        'use server'
        const rawFormData = Object.fromEntries(formData)
        const noFileSelected = (rawFormData.image.size === 0)
        let url1 = res.food[0]['FOOD_IMAGE'];
        if (!noFileSelected) {
            let { url } = await put(rawFormData.image.name, rawFormData.image, { access: 'public' });
            url1 = url;
        }

        const data = {
            fid: res.food[0]['ID'],
            name: rawFormData.name,
            description: rawFormData.description,
            price: rawFormData.price,
            image: url1
        }
        console.log(data);
        await post_with_token('jwt/updateFood', data);
        revalidatePath(`/chef/my/food/${res.food[0]['ID']}/ingredient`);
    }

    async function deleteFood() {
        'use server'
        const data = {
            fid: res.food[0]['ID']
        }
        console.log(data);
        await post_with_token('jwt/deleteFood', data);
        redirect('/chef/my');

    }
  return (
      <div className="grid grid-cols-2 space-y-1.5 p-6 border rounded-lg m-3 border-input  group">
          <Image blurDataURL={blurImg}  placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} src={res.food[0]['FOOD_IMAGE']} className='m-2 rounded-lg' width={200} height={200} />
          <form action={updateFood} className='grid place-content-center gap-6'>
              <Input name="name" type="text" defaultValue={res.food[0]['NAME']} className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight m-auto border-none focus:border-none"></Input>
              <Input name="description" type="text" defaultValue={res.food[0]['DESCRIPTION']} className="text-sm text-muted-foreground font-extralight"></Input>
              <div className='flex flex-wrap'>
                  <Input defaultValue="" className="text-sm text-muted-foreground font-extralight" type="file" name="image"></Input>
               </div>
              <Input defaultValue={res.food[0]['PRICE']} type="text" name="price" className="text-sm text-muted-foreground font-extralight"></Input>
              <Button3 type="submit">Update</Button3>
          </form>
          <form action={deleteFood} className='col-span-2'>
              <Button3 type="submit" className='bg-destructive'>Delete</Button3>
          </form>
      </div>
  )
}

export default SmallFood