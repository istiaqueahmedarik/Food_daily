'use client'
import { deleteKitchenImage } from '@/action'
import { decrypt, encrypt } from '@/util'
import { CheckCircleIcon, CircleX, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { useActionState } from 'react'

function KitchenImage({imageId, img , kid}) {
const [isDeleted, setIsDeleted] = React.useState(false)
  const onDelete = () => {
    setIsDeleted((prev) => !prev)
  }
  const img_enc = encrypt(img)
  return (
    <div className='relative border border-[#ffffff1f] rounded-lg overflow-hidden w-auto h-52 group m-5'>
      <Image src={img} alt="kitchen image" width={300} height={300} className='group-hover:scale-125 transition-all duration-500 h-52 w-fit m-auto' />
      {isDeleted ? <ConfirmDelete imageId={imageId} onDelete={onDelete} url={img_enc} kid={kid} /> :
        <Trash2
          className='absolute top-2 right-2 text-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer'
          onClick={onDelete}
        />}
    </div>
  )
}

export default KitchenImage

const prevState = {
  url: '',
}

const ConfirmDelete = ({ imageId,onDelete, url, kid }) => {
  prevState.url = url
  prevState.imageId = imageId
  prevState.kid = kid
  const [state, formAction] = useActionState(deleteKitchenImage, prevState)
  return (
    <form action={formAction} className='flex flex-wrap gap-2 absolute top-2 right-2 text-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer'>
      <button type='submit'>
        <CheckCircleIcon className='text-green-500' />
      </button>
      <button className='text-red-500' onClick={onDelete}>      <CircleX className='text-red-500' />
      </button>
    </form>
  )
}