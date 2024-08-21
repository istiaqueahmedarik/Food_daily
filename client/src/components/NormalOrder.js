import { addCart } from '@/action';
import Button from './ui/Button';

function NormalOrder({params,kid}) {
    const binded = addCart.bind(null, {
        params: params,
        kid: kid
    });
  return (
      <div>
          <form action={binded} className="flex flex-col gap-5">
              <input type="number" name="quantity" placeholder="Quantity" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue={1} />
              <Button txt={"Add to Cart"} />
          </form>
    </div>
  )
}

export default NormalOrder