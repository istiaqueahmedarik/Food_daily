import { getImage } from '@/util'
import Image from 'next/image'
import Link from 'next/link'


export default async function FoodCatCard({ edit, cat, title, subtitle }) {
    const blurImg = await getImage()

    return (
        <Link
            href={
                edit
                    ? `/chef/my/add_food/${cat.KITCHEN_ID}/category/${cat.ID}`
                    : `/chef/kitchen/${cat.KITCHEN_ID}/category/${cat.ID}`
            }
            className="m-5 block"
        >
            <div className="card-shadow relative h-96 overflow-hidden rounded-2xl bg-cover bg-center p-0">
                <Image
                    blurDataURL={blurImg}
                    placeholder="blur"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={60}
                    src={cat.CATEGORY_IMAGE}
                    alt="Background"
                    className="absolute inset-0 h-full object-cover"
                    fill
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-transparent">
                    <div className="flex h-full">
                        <div className="mt-auto mb-2 p-6 text-4xl font-semibold leading-none tracking-tight text-primary">
                            {title}
                            <br />
                            <span className="text-foreground">
                                {subtitle}
                                {cat.NAME}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}