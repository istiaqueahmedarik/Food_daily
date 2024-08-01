'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

const server_url = 'http://localhost:5001/'
async function post(url, data) {
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
}

export async function post_with_token(url, data) {
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
        })
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
}

export async function get_with_token(url) {
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

export async function uploadImage(formData)
{
    const img = formData.get('profileImage')
    console.log(img)

    const { url } = await put(img.name, img, { access: 'public' });

    await post_with_token('jwt/updateProfileImage', { 'profile_image_url': url })
    .then((res) => {
        console.log(res)
        revalidatePath('/profile')
    })
    .catch((error) => {
        console.error(error)
    })

}