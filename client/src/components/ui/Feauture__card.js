import Image from 'next/image'
import Link from 'next/link'

function Feauture__card(props) {
  return (
    <div className='max-w-xs bg-[#161b22]  p-5 text-center m-auto border border-[#ffffff1a] rounded-xl'>
      <Image quality={60} src={props.img} alt='Food plate' width={250} height={250} className='' />
          <h1 className='font-bold'>{props.title}</h1>
      <p className='p-5 text-[#474E56]'>{props.description}</p>
          <Link className='text-[#d5d5d56b] border pl-4 pr-4 pt-2 pb-2 rounded-md border-[#ffffff25] hover:text-white  ' href={props.link}>
              {props.linkText}
              </Link>

    </div>
  )
}

export default Feauture__card