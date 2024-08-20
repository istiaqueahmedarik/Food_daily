import Image from "next/image"
import Ingredients from "./Ingredients"
import Button from "./ui/Button";
import { addCart, get } from "@/action";
import { getImage } from "@/util";

async function Food({ params }) {
    

    // const res = await get(`getFood/${params.fid}`)
    // const rating = await get(`getFoodRating/${params.fid}`).Rating;
    const [res, rating] = await Promise.all([get(`getFood/${params.fid}`), get(`getFoodRating/${params.fid}`)])
    const binded = addCart.bind(null, {
        params: params,
        kid: res.result[0]['KITCHEN_ID']
    });
    const data = res.result[0];
    const blurImg = await getImage();

    const stars = []
    for (let i = 0; i < 5; i++) {
        if (i < rating.Rating)
            stars.push(<FullStar key={i} />)
        else if (i === rating.Rating && rating.Rating % 1 !== 0)
            stars.push(<HalfStar key={i} />)
        else
            stars.push(<EmptyStar key={i} />)
    }
  return (
      <div>
          <div className="bg-card text-card-foreground overflow-hidden rounded-lg shadow-lg  m-7 foreground-grad border border-input">
              <div className="grid md:grid-cols-2 my-auto">
                  <Image blurDataURL={blurImg}  placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60}
                      src={data['FOOD_IMAGE']}
                      alt="Food Image"
                      width="300"
                      height="200"
                      className="object-cover w-full h-full rounded-lg aspect-w-3 aspect-h-2"
                  />
                  <div className="p-6 md:p-8 flex flex-col gap-4">
                      <div className="grid gap-2">
                          <h2 className="text-2xl font-bold">{data['NAME']}</h2>
                          <span className="flex flex-wrap">
                              <span className="flex gap-1">{stars}</span>
                              <span className="text-muted-foreground">({rating.Rating})</span>
                          </span>
                          
                          <p className="text-muted-foreground">
                              {data['DESCRIPTION']}
                          </p>
                      </div>
                      <div className="grid gap-2 max-h-72 ">
                          <Ingredients res={res} params={params} />
                      </div>
                      <div className="flex items-center justify-between">
                          <div className="text-3xl font-bold">৳ { data['PRICE']}</div>
                      </div>
                      <div>
                          <form action={binded} className="flex flex-col gap-5">
                              <input type="number" name="quantity" placeholder="Quantity" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue={1}/>
                              <Button txt={"Add to Cart"}/>
                          </form>

                      </div>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default Food


const FullStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-foreground">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

const HalfStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-foreground">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12 5.173V18.354l4.627 2.826c.996.608 2.231-.29 1.96-1.425l-1.257-5.273 4.117-3.527c.887-.76.415-2.212-.749-2.305l-5.404-.433-2.082-5.006c-.448-1.077-1.976-1.077-2.424 0L10.788 3.21l-5.404.433c-1.164.093-1.636 1.545-.749 2.305l4.117 3.527-1.257 5.273c-.271 1.136.964 2.033 1.96 1.425L12 18.354V5.173z" clipRule="evenodd" fill="foreground" />
    </svg>
);

const EmptyStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);