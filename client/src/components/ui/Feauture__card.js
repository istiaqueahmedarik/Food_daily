import { get_with_token } from '@/action'
import { getImage } from '@/util'
import Image from 'next/image'
import Link from 'next/link'

async function Feauture__card(props) {
  let status = false
  let statusText = ""
  let statusLink = ""
  if (props.type === "delivery")
  {
    const res = await get_with_token('jwt/isDelivery');
    status = res.status
    if (status)
    {
      statusText = "Delivery Dashboard"
      statusLink = "/delivery"
    }
  }
  if (props.type === "chef")
  {
    const res = await get_with_token('jwt/isChef');
    status = res.status
    if (status)
    {
      statusText = "Chef Dashboard"
      statusLink = "/chef/my"
    }
  }
  if (props.type === "qa")
  {
    const res = await get_with_token('jwt/isQa');
    status = res.status
    if (status) {
      statusText = "QA Dashboard"
      statusLink = "/qa_dashboard/qa"
    }
  }
  const blurImg = await getImage();
  return (
    <div className='max-w-xs bg-background  p-5 text-center m-auto border border-input rounded-xl'>
      <Image blurDataURL={blurImg} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} src={props.img} alt='Food plate' width={250} height={250} className='' />
          <h1 className='font-bold'>{props.title}</h1>
      <p className='p-5 text-muted-foreground'>{props.description}</p>
      <Link className='text-muted-foreground border pl-4 pr-4 pt-2 pb-2 rounded-md border-input  hover:text-foreground  ' href={props.type === 'food' || status === false ? props.link : statusLink}>
        {props.type ==='food' || status===false?props.linkText:statusText}
              </Link>
     
    </div>
  )
}

export default Feauture__card