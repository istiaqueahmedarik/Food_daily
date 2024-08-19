'use client'
import { addKitchenImage } from '@/action';
import Image from 'next/image';
import React, { useActionState, useState } from 'react';
import Button from './ui/Button';

const prevState = {
    message: '',
    kid: '',
}

function ImageUploader({ kid }) {
    const [selectedFile, setSelectedFile] = useState(null);
    prevState.kid = kid;
    const [state, formAction] = useActionState(addKitchenImage, prevState);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(URL.createObjectURL(file));
        }
    };

    return (
        <div>
        <form action={formAction} className="max-w-lg mx-auto bg-background p-6 rounded-lg shadow-md border border-[#ffffff21]">
           
            <div className=" rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-2">Upload your kitchen image</h2>
                <p className="text-sm text-gray-500 mb-4">Accepted formats: .png, .jpg, .gif, .svg</p>
                <div className="mb-4">
                    {selectedFile ? (
                            <Image blurDataURL='/blur_food.png' placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} width={500} height={500} src={selectedFile} alt="Selected file" className="bg-background h-48 flex items-center justify-center border border-[#ffffff21]" />
                    ) : (
                            <div className="bg-background h-48 flex items-center justify-center border border-[#ffffff21]">
                            <p className="text-gray-400">No file selected</p>
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    accept=".png,.jpg,.gif,.svg"
                    onChange={handleFileChange}
                    className="hidden m-auto w-full"
                    id="file-upload"
                        name='img'
                        required
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-background text-white py-2 px-4 rounded border border-[#ffffff21] transition duration-300 m-auto w-full text-center"
                >
                    Choose file
                </label>
            </div>
            <Button />
            
        </form>
        <div>
                {
                    
                }
            </div>
        </div>
    );
}

export default ImageUploader;