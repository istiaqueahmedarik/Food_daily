import { post, post_with_token } from '@/action'
import ApplyKitchen from '@/components/ApplyKitchen'
import ImageUploader from '@/components/ImageUploader'
import KitchenImage from '@/components/ui/KitchenImage'
import { getBlur } from '@/util'
import Image from 'next/image'
import { redirect } from 'next/navigation'

async function page({params}) {
    // const data = await post_with_token('jwt/getKitchen', { kitchenId: params.id })
    const [kitchen, kitchen_images] = await Promise.all([post('getKitchen', { kitchenId: params.id }), post_with_token('jwt/getKitchenImage', { kitchenId: params.id })])
    if (kitchen.error !== undefined || kitchen.result.length === 0) {
        redirect('/404')
    }
  return (
      <div>
          <div className='h-20'></div>
          <div className='h-auto w-full'>
              <h1 className='text-center mb-2 w-full text-2xl font-bold'>
                  Your Kitchen Images
              </h1>
              <div className='grid grid-cols-2'>
                  <div className='my-auto'>
                      <ImageUploader kid={params.id} />
                  </div>
                  <div className='m-5 p-5 flex flex-wrap'>
                      
                      {kitchen_images.image.map((img, idx) => {
                          return (
                              <KitchenImage imageId={img['ID']} key={idx} img={img['IMAGE']} kid={params.id} />
                          )
                      })}
                  </div>
              </div>
              <div className='m-5 flex flex-wrap p-5'>
                  <div>
                      <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} src={'/update_kitchen.svg'} alt='update kitchen' width={600} height={400} />
                  </div>
                  <div className='m-auto'>
                      <ApplyKitchen edit={true} kid={params.id} data={{
                          KICHEN_NAME: kitchen.result[0]['KICHEN_NAME'],
                          KITCHEN_CITY_NAME: kitchen.result[0]['KITCHEN_CITY_NAME'],
                          KITCHEN_ADDRESS: kitchen.result[0]['KITCHEN_ADDRESS']
                      }} />
                  </div>
             </div>

          </div>
      </div>
  )
}

export default page