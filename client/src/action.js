'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { del } from '@vercel/blob';
import { decrypt } from "./util";
import { cache } from "react";
import { uuidv7 } from "uuidv7";
const server_url = 'http://localhost:5001/'
export const post = cache(async(url, data)=>{
    url = server_url + url

   
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }, {
            cache: 'force-cache'
        },
            { next: { revalidate: 6000 } })
        try {
            const json = await response.json()
            return json
        }
        catch (error) {
            console.error('Error:', error)
        }
    
})

export const basic_post = cache(async (url, data) => {

   
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
    
})

export const get = cache(async (url) => { 
    url = server_url + url
   
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
    
})

export const post_with_token = cache(async (url, data) => {
    
    const token = cookies().get('token')
    if (token === undefined)
        return {
            error: 'Unauthorized'
        }
    
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
   
})

export const get_with_token = cache(async (url) => {
    const token = cookies().get('token')
    if (token === undefined)
        return {
            error: 'Unauthorized'
        }
   
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

export async function applyChef(prevState,formData) {
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
    revalidatePath('/admin/qa')
}

export async function approveDelivery(st, formData) {
    // const rawFormData = Object.fromEntries(formData)
    const response = await post_with_token('jwt/approveDelivery', st)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    revalidatePath('/admin/qa')
}

export async function disapproveDelivery(st, formData) { 
    // const rawFormData = Object.fromEntries(formData)
    const response = await post_with_token('jwt/disapproveDelivery', st)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    revalidatePath('/admin/qa')
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
    
    await post_with_token('jwt/addIngredient', raw)
        .then(() => {
            revalidatePath(`/chef/my/food/${food_id}/ingredient`)
            return {
                message: 'Ingredient added'
            }
        })
        .catch((error) => {
            revalidatePath(`/chef/my/food/${food_id}/ingredient`)

            return {
                error: 'An error occurred'
            }
        })
   
}

export async function deleteIngredient(st, formData)
{
    const response = await post_with_token('jwt/deleteIngredient', { iid: st.iid })
    revalidatePath(`/chef/my/food/${st.fid}/ingredient`)
}

export async function addCart(st, formData)
{
    const raw = Object.fromEntries(formData)
    await post_with_token('jwt/addToCart', { 'food_id': st.params.fid, 'quantity': raw.quantity })
    redirect(`/chef/kitchen/${st.kid}`)
}

export async function addCartScheduled(data) {
    console.log(data)
    await post_with_token('jwt/addToCartScheduled', data)
    redirect(`/chef/kitchen/${data.kid}`)
}

export async function deleteCart(st, formData)
{
    
    const response = await post_with_token('jwt/deleteFromCart', { 'cart_id': st })
    revalidatePath('/cart')
}

export async function checkout(formData)
{
    const raw = Object.fromEntries(formData)
    

    const cart = await get_with_token('jwt/getCart');
    const res = await get_with_token('jwt/chefDetails');
    const token = cookies().get('token')
    if (token === undefined)
        return {
            error: 'Unauthorized'
        }
    const store_id = process.env.SSL_STORE_ID || 'mrs6579e610249a7'
    const store_passwd = process.env.SSL_PASS || 'mrs6579e610249a7@ssl'
    const is_live = false
    const unique = uuidv7()
    const data = {
        total_amount: cart.sm[0]['TOTAL'],
        currency: raw.currency,
        tran_id: unique, 
        success_url: server_url +'sslcommerz/success',
        fail_url: server_url + 'sslcommerz/fail',
        cancel_url: server_url + 'sslcommerz/cancel',
        ipn_url: server_url + 'sslcommerz/ipn',
        shipping_method: 'Courier',
        product_name: 'Food.',
        product_category: 'Food',
        product_profile: 'Food',
        cus_name: res.result[0]['FIRST_NAME'] + ' ' + res.result[0]['LAST_NAME'],
        cus_email: res.result[0]['EMAIL'],
        cus_add1: res.result[0]['ADDRESS'],
        cus_add2: '',
        cus_city: '',
        cus_state: '',
        cus_postcode: '',
        cus_country: '',
        cus_phone: res.result[0]['CITY_CODE']+' '+res.result[0]['PHONE'],
        cus_fax: '',
        ship_name: raw.ship_name,
        ship_add1: raw.ship_add1,
        ship_add2: '',
        ship_city: raw.ship_city,
        ship_state: '',
        ship_postcode: raw.ship_postcode,
        ship_country: raw.ship_country,
        value_a: token.value,
        value_b: raw.ship_add1 + ' ' + raw.ship_city + ' ' + raw.ship_country + ' ' + raw.ship_postcode,
        value_c: raw.ship_mobile,
        value_d: raw.ship_name
    };

    const rawbody = 'store_id=' + store_id + '&store_passwd=' + store_passwd + '&total_amount=' + data.total_amount + '&currency=' + data.currency + '&tran_id=' + data.tran_id + '&success_url=' + data.success_url + '&fail_url=' + data.fail_url + '&cancel_url=' + data.cancel_url + '&ipn_url=' + data.ipn_url + '&shipping_method=' + data.shipping_method + '&product_name=' + data.product_name + '&product_category=' + data.product_category + '&product_profile=' + data.product_profile + '&cus_name=' + data.cus_name + '&cus_email=' + data.cus_email + '&cus_add1=' + data.cus_add1 + '&cus_add2=' + data.cus_add2 + '&cus_city=' + data.cus_city + '&cus_state=' + data.cus_state + '&cus_postcode=' + data.cus_postcode + '&cus_country=' + data.cus_country + '&cus_phone=' + data.cus_phone + '&cus_fax=' + data.cus_fax + '&ship_name=' + data.ship_name + '&ship_add1=' + data.ship_add1 + '&ship_add2=' + data.ship_add2 + '&ship_city=' + data.ship_city + '&ship_state=' + data.ship_state + '&ship_postcode=' + data.ship_postcode + '&ship_country=' + data.ship_country + '&value_a=' + data.value_a + '&value_b=' + data.value_b + '&value_c=' + data.value_c + '&value_d=' + data.value_d;
   
    const response = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token.value}`

        },
        body: rawbody
    });

    const dt = await response.json();
    redirect(dt.GatewayPageURL);
}

export async function applyDelivery(formData)
{
    const raw = Object.fromEntries(formData)
    const {url} = await put(raw.driver_license.name, raw.driver_license, { access: 'public' });
    const rawData = {
        'license': url,
        'vehicle': raw.vehicle
    }
    const response = await post_with_token('jwt/applyDelivery', rawData)
    if (response.error !== undefined)
        return {
            message: response.error
        }
    redirect('/success_delivery')
}

export async function acceptOrder(st, formData)
{
    const response = await post_with_token('jwt/acceptOrder', { 'oid': st })
    revalidatePath('/delivery')
}



export async function completeOrder(st, formData)
{
    const response = await post_with_token('jwt/completeOrder', { 'oid': st })
    revalidatePath('/delivery')
}

export async function cancelOrder(st, formData)
{
    const response = await post_with_token('jwt/cancelOrder', { 'oid': st })
    revalidatePath('/delivery')
}

export async function deleteKitchen(edit, formData)
{
    
    const response = await post_with_token('jwt/deleteKitchen', { 'kitchenId': edit });
    revalidatePath('/chef/my')
}

export async function searchFood(prevState, formData) {
    const searchQuery = formData.get('searchQuery')
    const sortOption = formData.get('sortOption')
    const selectedCities = formData.getAll('selectedCities')
    const selectedChefs = formData.getAll('selectedChefs')
    const priceRange = formData.getAll('priceRange')
    const rating = formData.get('rating')

    const searchParams = new URLSearchParams()
    if (searchQuery) searchParams.set('query', searchQuery)
    if (sortOption) searchParams.set('sort', sortOption)
    if (selectedCities.length) searchParams.set('cities', selectedCities.join(','))
    if (selectedChefs.length) searchParams.set('chefs', selectedChefs.join(','))
    if (priceRange.length) searchParams.set('price', priceRange.join(','))
    if (rating) searchParams.set('rating', rating)

    const queryString = searchParams.toString()
    redirect(`/?${queryString}`)
}

export async function reviewFood(formData)
{
    
    const res = await post_with_token('jwt/addRating', formData);
    
    revalidatePath(`/chef/kitchen/food/${formData.food_id}`)
    
}

export async function acceptFoodChef(st, formData)
{
    const response = await post_with_token('jwt/accptOrderChef', { 'oid': st.oid })
    revalidatePath(`/chef/my/${st.kid}`)
}




export async function PersonalCancelOrder(st, formData)
{
    const response = await post_with_token('jwt/PersonalCancelOrder', { 'oid': st })
    revalidatePath('/profile')
}


export async function reportAddFood(st, formData)
{
    const report = formData.get('report')
    const response = await post_with_token('jwt/addReport', {
        'fid': st,
        'report': report
    })
    redirect(`/success_report`)
}

export async function resolvedIssue(st)
{
    const res = await post_with_token('jwt/resolveReport', { 'rid': st })
    revalidatePath('/admin/reports')
}

export async function investigateIssue(st, status)
{
    const res = await post_with_token('jwt/investigateReport', { 'rid': st })
    console.log(st)
    revalidatePath('/admin/reports')
}

export async function banChef(st)
{
    const res = await post_with_token('jwt/banChef', { 'cid': st })
    revalidatePath('/admin/manage')
}
export async function unbanChef(st)
{
    const res = await post_with_token('jwt/unbanChef', { 'cid': st })
    revalidatePath('/admin/manage')
}

export async function addAdmin(formData)
{
    const email = formData.get('email')
    const response = await post_with_token('jwt/addAdmin', { 'email': email })
    revalidatePath('/admin/approve')
}

export async function removeAdmin(st)
{
    const response = await post_with_token('jwt/removeAdmin', { 'email': st })
    revalidatePath('/admin/approve')
}


export async function runQuery(query) { 
    const res = await post_with_token('jwt/runQuery', { 'query': query })
    console.log(query)
    if (res.error !== undefined)
        return {
            error: res.error
        }
    return res;
}