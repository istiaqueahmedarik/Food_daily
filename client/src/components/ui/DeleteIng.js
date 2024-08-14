import { deleteIngredient } from '@/action';
import { DeleteIcon } from 'lucide-react';
import React from 'react'

function DeleteIng({ fid, iid }) {
    const st = {
        fid: fid,
        iid: iid
    }
    const binded = deleteIngredient.bind(null, st);
  return (
      <form action={binded}>
          <button type='submit' className='border border-[#ffffff1b] text-white rounded-lg p-2'>
              <DeleteIcon size={24} />
          </button>
    </form>
  )
}

export default DeleteIng