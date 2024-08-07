import { uploadImage } from '@/action'
import Image from 'next/image'
import React from 'react'
import Button from './ui/Button'

export default function ProfileImage(props) {
  return (
    <form action={uploadImage} className="grid place-content-center">
      <label htmlFor="profileImageInput">
        <Image src={props.img} alt="Food plate" width={600} height={400} className="rounded-full bg-cover cursor-pointer max-w-72 max-h-max" />
      </label>
      <input
        type="file"
        id="profileImageInput"
        name="profileImage"
        style={{ display: 'none' }}
      />
      <Button txt={"Update Image"} />

    </form>
  )
}
