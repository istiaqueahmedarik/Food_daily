import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import ProductList from "./ProductList"

export default function Popular() {
    const foodCategories = [
        "Italian",
        "Japanese",
        "Mexican",
        "Indian",
        "American",
        "Chinese",
        "Thai",
        "French",
    ]

    const popularFoods = [
        { name: "Pizza", origin: "Italy", kitchen: "Bella Italia", chef: "Mario Rossi" },
        { name: "Sushi", origin: "Japan", kitchen: "Sakura Sushi", chef: "Yuki Tanaka" },
        { name: "Tacos", origin: "Mexico", kitchen: "El Mariachi", chef: "Carlos Sanchez" },
        { name: "Burger", origin: "USA", kitchen: "American Diner", chef: "John Smith" },
        { name: "Pad Thai", origin: "Thailand", kitchen: "Thai Spice", chef: "Somchai Lee" },
    ]

    const topChefs = [
        { name: "Gordon Ramsay", specialty: "International" },
        { name: "Julia Child", specialty: "French" },
        { name: "Massimo Bottura", specialty: "Italian" },
        { name: "Dominique Crenn", specialty: "Modern French" },
    ]

    return (
        <div className="container mx-auto p-4 space-y-8">
            <section className="text-center">
                <h2 className="text-2xl font-bold mb-4">Popular Food Categories</h2>
                <div className="flex flex-wrap justify-center gap-2">
                    {foodCategories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                            {category}
                        </Badge>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Popular Foods</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularFoods.map((food, index) => (
                        <Card key={index}>
                            <CardContent className="pt-6">
                                <div className="relative">
                                    <img
                                        src={`/placeholder.svg?height=200&width=300`}
                                        alt={food.name}
                                        className="w-full h-48 object-cover rounded-md mb-2"
                                    />
                                    <Avatar className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 border-4 border-background">
                                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={food.chef} />
                                        <AvatarFallback>{food.chef[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <h3 className="font-semibold text-lg mt-4">{food.name}</h3>
                                <p className="text-sm text-muted-foreground">{food.origin}</p>
                                <p className="text-sm font-medium mt-2">{food.kitchen}</p>
                                <p className="text-xs text-muted-foreground">Chef: {food.chef}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Top Chefs</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {topChefs.map((chef, index) => (
                        <Card key={index}>
                            <CardHeader className="text-center">
                                <Avatar className="w-20 h-20 mx-auto">
                                    <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={chef.name} />
                                    <AvatarFallback>{chef.name[0]}</AvatarFallback>
                                </Avatar>
                                <CardTitle className="mt-2">{chef.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{chef.specialty} Cuisine</p>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>
            <ProductList />

        </div>
    )
}