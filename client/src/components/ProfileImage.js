'use client'
import { uploadImage } from '@/action'
import Image from 'next/image'
import React, { useActionState, useState } from 'react'
import Button from './ui/Button'
import { getBlur } from '@/util'
const prevState = {
  message: '',
  profile_image_url: '',
}
export default function ProfileImage(props) {
  prevState.profile_image_url = props.img;
  const [state, formAction] = useActionState(uploadImage, prevState);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
    }
  };
  return (
    <form action={formAction} className="grid place-content-center">
      <label htmlFor="profileImageInput">
        {selectedFile ? (
          <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} width={600} height={400} src={selectedFile} alt="Selected file" className="aspect-square object-cover rounded-full bg-cover cursor-pointer max-w-72 max-h-max" />
        ) : (
            <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={60} src={props.img} alt="Food plate" width={600} height={400} className="aspect-square object-cover  rounded-full bg-cover cursor-pointer max-w-72 max-h-max" />
        )}
      </label>
      <input
        type="file"
        id="profileImageInput"
        name="profileImage"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button txt={"Update Image"} />

    </form>
  )
}
