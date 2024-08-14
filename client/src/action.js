'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { del } from '@vercel/blob';
import { decrypt } from "./util";
import { cache } from "react";
const server_url = 'http://localhost:5001/'
export const post = cache(async(url, data)=>{
    url = server_url + url

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        try {
            const json = await response.json()
            return json
        }
        catch (error) {
            console.error('Error:', error)
        }
    } catch (error) {
        console.error('Error:', error)
    }
})

export const get = cache(async (url) => { 
    url = server_url + url
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
            , {
                cache: 'force-cache'
            },
            { next: { revalidate: 6000 } }
        )
        try {
            const json = await response.json()
            return json
        }
        catch (error) {
            console.error('Error:', error)
        }
    } catch (error) {
        console.error('Error:', error)
    }
})

export const post_with_token = cache(async (url, data) => {
    
    const token = cookies().get('token')
    if (token === undefined)
        return {
            error: 'Unauthorized'
        }
    try {
        const response = await fetch(server_url + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            },
            body: JSON.stringify(data)
        }
            , {
                cache: 'force-cache'
            },
            { next: { revalidate: 6000 } }
        )
        try {
            const json = await response.json()
            return json
        }
        catch (error) {
            console.error('Error:', error)
            return {
                error: 'An error occurred'
            }
        }
    }
    catch (error) {
        console.error('Error:', error)
        return {
            error: 'An error occurred'
        }
    }
})

export const get_with_token = cache(async (url) => {
    const token = cookies().get('token')
    if (token === undefined)
        return {
            error: 'Unauthorized'
        }
    try {
        const response = await fetch(server_url + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            }
        }, {
            cache: 'force-cache'
        },
            { next: { revalidate: 6000 } }
        )
        try {
            const json = await response.json()
            return json
        }
        catch (error) {
            return {
                error: 'An error occurred ' + error
            }
        }
    }
    catch (error) {
        return {
            error: 'An error occurred ' + error
        }
    }
})
export async function deleteKitchenImage(prevState, formData) 
{
    const url = prevState.url
    const decrypted = decrypt(url)
    
    await del(decrypted);
    const imageId = prevState['imageId']
    await post_with_token('jwt/deleteKitchenImage', { 'imageId': imageId })
        .then(() => {
            revalidatePath(`/chef/kitchen/edit/${prevState.kid}`)
        })
        .catch((error) => {
            console.error(error)
        })
    
}



export async function signup(prevState, formData) {
    const rawFormData = Object.fromEntries(formData)
    if (rawFormData.password !== rawFormData.confirmPassword)
        return {
            message: 'Passwords do not match'
        }
    const response = await post('signup', rawFormData)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    if (response.token === undefined)
        return {
            message: 'An error occurred'
        }
    redirect('/login')
}

export async function login(prevState, formData) {
    const rawFormData = Object.fromEntries(formData)

    const response = await post('login', rawFormData)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    if (response.token === undefined)
        return {
            message: 'An error occurred'
        }
    cookies().set('token', response.token)
    redirect('/profile')
} 

export async function uploadImage(prevState,formData)
{
    const img = formData.get('profileImage')
    const prevImg = prevState['profile_image_url']
    const substr = '3q4uyhbcfmsq5ih5.public.blob.vercel-storage.com'
    const index = prevImg.search(substr);

    if (index !== -1) 
        await del(prevImg);
   
    

    const { url } = await put(img.name, img, { access: 'public' });

    await post_with_token('jwt/updateProfileImage', { 'profile_image_url': url })
    .then((res) => {
        
        revalidatePath('/profile/edit')
    })
    .catch((error) => {
        console.error(error)
    })

}

export async function addKitchenImage(prevState,formData)
{
    const img = formData.get('img')
    const kitchenId = prevState['kid']
    if (kitchenId === undefined || img === undefined)
    {
        return {
            message: 'An error occurred'
        }
    }
    
    if(img.name === undefined)
    {
        return {
            message: 'An error occurred'
        }
    }
    
    await put(img.name, img, { access: 'public' })
        .then(async (res) => {
            await post_with_token('jwt/addKitchenImage', { 'image': res.url, 'kitchenId': kitchenId })
                .then(() => {
                    revalidatePath(`/chef/kitchen/edit/${kitchenId}`)
                    return {
                        message: 'Image uploaded'
                    }
                })
                .catch((error) => {
                    console.error(error)
                    return {
                        message: 'An error occurred'
                    }
                })
        })
        .catch((error) => {
            console.error(error)
            return {
                message: 'An error occurred'
            }
         })

}

export async function editKitchen(prevState, formData)
{
    let rawFormData = Object.fromEntries(formData)
    rawFormData.kitchenId = prevState.kid
    
    const response = await post_with_token('jwt/editKitchen', rawFormData)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    revalidatePath(`/chef/kitchen/edit/${prevState.kid}`)
    return {
        message: 'Kitchen updated'
    }
    
}

export async function applyChef(formData) {
    const rawFormData = Object.fromEntries(formData)
    const response = await post_with_token('jwt/applyChef', rawFormData)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    redirect('/success')
}

export async function updateProfile(formData) {
    const rawFormData = Object.fromEntries(formData)
    
    const response = await post_with_token('jwt/updateProfile', rawFormData)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    revalidatePath('/profile')
    redirect('/profile')
}


export async function add_kitchen(prevState, formData)
{
    const rawFormData = Object.fromEntries(formData)
    const response = await post_with_token('jwt/addKitchen', rawFormData)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    redirect('/succeess_kitchen')
}

export async function add_certificate(prevState,formData)
{
    const rawFormData = Object.fromEntries(formData)
    
    const idate = new Date(formData.get('issueDate'))
    const edate = new Date(formData.get('expiryDate'))
    if(idate > edate)
    {
        return {
            message: 'Issue date cannot be greater than expiry date'
        }
    }

    // certification: string, issueDate: string, expiryDate: string, link: string, name: string
    const img = formData.get('certificate')
    const { url } = await put(img.name, img, { access: 'public' });
    const raw = {
        certification: url,
        issueDate: formData.get('issueDate'),
        expiryDate: formData.get('expiryDate'),
        link: formData.get('link'),
        name: formData.get('name'),
    }

    const response = await post_with_token('jwt/addCertification', raw)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    redirect('/chef/my')
}

export async function qa_apply(formData)
{
    const cv = formData.get('cv')
    const { url } = await put(cv.name, cv, { access: 'public',multipart:true });
    
    const response = await post_with_token('jwt/applyQAofficer', { 'CV_LINK': url, ACADEMIC_QUALIFICATION: formData.get('qualification') })
    if (response.error !== undefined)
        return {
            message: response.error
        }
    redirect('/profile')
}

export async function approveQAofficer(st,formData)
{
    // const rawFormData = Object.fromEntries(formData)
    if (st.st === 2)
    {
        const url = st.url
        await del(url)
    }
    const response = await post_with_token('jwt/approveQA', st)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    revalidatePath('/admin')
}

export async function approveKitchen(st,formData)
{
    // const rawFormData = Object.fromEntries(formData)
    const response = await post_with_token('jwt/approveKitchen', st)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    revalidatePath('/admin')
}

export async function disapproveKitchen(st, formData) {
    // const rawFormData = Object.fromEntries(formData)
    const imgs = await post_with_token('jwt/getKitchenImages', st)
    const response = await post_with_token('jwt/disapproveKitchen', st)

    
    imgs.result.forEach(async (img) => {
        await del(img['IMAGE'])
    })
    if (response.error !== undefined)
        return {
            message: response.error
        }
    revalidatePath('/admin/qa')
}

export async function addCategory(st, formData)
{
    const rawFormData = Object.fromEntries(formData)
    
    // make st to uppercase
    const kitchen_id = st.toUpperCase()
    const {url} = await put(rawFormData.categoryImage.name, rawFormData.categoryImage, { access: 'public' });
    const response = await post_with_token('jwt/addCategory', { 'kitchen_id': kitchen_id, 'name': rawFormData.category, 'description': rawFormData.description, 'category_image': url })
    
    redirect(`/chef/my/${kitchen_id}`)
}


export async function addDish(st, formData)
{
    let foodImage = formData.get('foodImage')
    const foodImageName = foodImage.name;
    const { url } = await put(foodImageName, foodImage, { access: 'public' });
    const foodName = formData.get('foodName')
    const foodDescription = formData.get('foodDescription')
    const foodPrice = formData.get('foodPrice')
    

    const response = await post_with_token('jwt/addDish', { 'kitchen_id': st.id, 'category_id': st.cid, 'name': foodName, 'description': foodDescription, 'price': foodPrice, 'image': url });
    
    const fid = response.fid[0]['ID'];
    redirect(`/chef/my/food/${fid}/ingredient`)
}

export async function addIngredient(st, formData)
{
    const name = formData.get('name')
    const quantity = formData.get('quantity')
    const calories = formData.get('calories')
    const food_id = st
    const raw = {
        name: name,
        quantity: quantity,
        calories: calories,
        food_id: food_id
    }
    const response = await post_with_token('jwt/addIngredient', raw)
    
    revalidatePath(`/chef/my/food/${food_id}/ingredient`)
}

export async function deleteIngredient(st, formData)
{
    const response = await post_with_token('jwt/deleteIngredient', { iid: st.iid })
    revalidatePath(`/chef/my/food/${st.fid}/ingredient`)
}