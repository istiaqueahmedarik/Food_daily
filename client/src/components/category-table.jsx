import { Input } from "@/components/ui/input"
import { Button3 } from "@/components/ui/button3"
import { ScrollArea } from "@/components/ui/scroll-area"
import { get_with_token, post_with_token } from "@/action"
import { Card } from "./ui/card"
import Image from "next/image"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"


export default async function CategoryTable({id}) {
  const categories = await get_with_token(`jwt/allCategory/${id}`)
  console.log('Categories:', categories)
  console.log(categories)
  const handleSubmit = async (st,formData) => {
    'use server'
    const rawFormData = Object.fromEntries(formData)
    console.log('Form Data:', rawFormData)
    // const noFileSelected = (image size is 0) 
    const noFileSelected = (rawFormData.image.size === 0)
    let url1 = st.img;
    if (!noFileSelected) {
      let { url } = await put(rawFormData.image.name, rawFormData.image, { access: 'public' });
      url1 = url;
    }


    const res = await post_with_token('jwt/updateCategory', {
      cat_id: st.id,
      name: rawFormData.name,
      description: rawFormData.description,
      image: url1
    })
    console.log('No File Selected:', noFileSelected)
    revalidatePath(`/chef/my/${id}`)
  }

  const deleteCategory = async (id) => { 
    'use server'
    const res = await post_with_token('jwt/deleteCategory', {
      cat_id: id
    })
    revalidatePath(`/chef/my/${id}`)
  }
  return (
    <ScrollArea className="h-[400px]  rounded-md border p-5">
      <div>
        <div>
          <div className="grid grid-cols-5 gap-8">
            <div>Name</div>
            <div>Description</div>
            <div>Image URL</div>

          </div>
        </div>
        <div>
          {categories.map((category) => {
            const binded = handleSubmit.bind(null, {
              img: category['CATEGORY_IMAGE'],
              id: category['ID']
            });
            const bindedDelete = deleteCategory.bind(null, category['ID']);
            return (
              <div key={category['ID']} className="flex flex-row gap-6">
                <form action={binded} className="grid grid-cols-4 gap-6">
                  <div>
                    <Input
                      defaultValue={category['NAME']}
                      name="name"
                      type="text"
                    />
                  </div>
                  <div>
                    <Input
                      defaultValue={category['DESCRIPTION']}
                      name="description"
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-[4fr_1fr] gap-2">
                    <Input
                      defaultValue={""}
                      type="file"
                      name="image"
                    />
                    <Image src={category['CATEGORY_IMAGE']} alt={category['NAME']} width={50} height={30} className="rounded-md h-8 w-8" />
                  </div>
                  <div>
                    <Button3 type="submit">Save</Button3>
                  </div>
                  
                </form>
                <form action={bindedDelete}>
                  <Button3 className="bg-destructive" type="submit">Delete</Button3>
                </form>
              </div>
            )
          })}
        </div>
      </div>
    </ScrollArea>
  )
}