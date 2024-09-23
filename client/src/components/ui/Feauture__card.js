import { get_with_token } from '@/action'
import { getImage } from '@/util'
import Image from 'next/image'
import Link from 'next/link'

async function FeatureCard(props) {
  let status = false
  let statusText = ""
  let statusLink = ""
  if (props.type === "delivery") {
    const res = await get_with_token('jwt/isDelivery');
    status = res.status
    if (status) {
      statusText = "Delivery Dashboard"
      statusLink = "/delivery"
    }
  }
  if (props.type === "chef") {
    const res = await get_with_token('jwt/isChef');
    status = res.status
    if (status) {
      statusText = "Chef Dashboard"
      statusLink = "/chef/my"
    }
  }
  if (props.type === "qa") {
    const res = await get_with_token('jwt/isQa');
    status = res.status
    if (status) {
      statusText = "QA Dashboard"
      statusLink = "/qa_dashboard/qa"
    }
  }
  const blurImg = await getImage();

  return (
    <div className="relative max-w-xs mx-auto overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm" />
      <div className="relative z-10 p-6 bg-background/80 backdrop-blur-sm border border-input rounded-xl transition-all duration-300 hover:bg-background/90 hover:shadow-lg">
        <div className="mb-4 overflow-hidden rounded-lg">
          <Image
            blurDataURL={blurImg}
            placeholder='blur'
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={60}
            src={props.img}
            alt='Feature image'
            width={250}
            height={250}
            className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
          />
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground">{props.title}</h2>
        <p className="mb-4 text-sm text-muted-foreground">{props.description}</p>
        <Link
          className={`inline-block px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-md 
            ${props.type === 'food' || status === false
              ? props.linkText === '' && 'hidden'
              : statusText === '' && 'hidden'} 
            ${status
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'}`
          }
          href={props.type === 'food' || status === false ? props.link : statusLink}
        >
          {props.type === 'food' || status === false ? props.linkText : statusText}
        </Link>
      </div>
    </div>
  )
}

export default FeatureCard