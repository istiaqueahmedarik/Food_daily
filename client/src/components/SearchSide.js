"use client"
import { useState, useMemo } from 'react'
import { Input } from "@/components/ui/input"
import { Button3, buttonVariants } from "@/components/ui/button3"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StarIcon, SearchIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react'
import { redirect, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ScrollArea } from './ui/scroll-area'

export default function SearchSide(props) {
    const searchQ = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchQ.get('search') || "")
    const [citySearch, setCitySearch] = useState("")
    const [chefSearch, setChefSearch] = useState("")
    const [kitchenSearch, setKitchenSearch] = useState("")
    const tmp = searchQ.get('city')
    let splited = tmp ? tmp.split(',') : []
    splited = splited.map((city) => city.toUpperCase())
    const [selectedCities, setSelectedCities] = useState(splited)
    const tmpChef = searchQ.get('chef')
    const [selectedChefs, setSelectedChefs] = useState(tmpChef ? tmpChef.split(',') : [])
    const tmpKitchen = searchQ.get('kitchen')
    const [selectedKitchens, setSelectedKitchens] = useState(tmpKitchen ? tmpKitchen.split(',') : [])
    const tempPrice = searchQ.get('price') ? searchQ.get('price').split(',').map(Number) : props.prices;
    const [priceRange, setPriceRange] = useState(tempPrice)
    const [rating, setRating] = useState(Number(searchQ.get('rating')) || 0)
    const [sortOption, setSortOption] = useState(searchQ.get('sort') || "default")
    
    const cities = props.cities
    const chefs = props.chefs
    const kitchens = props.kitchens

  

    const filteredCities = useMemo(() => {
        return cities.filter(city => city.toLowerCase().includes(citySearch.toLowerCase()))
    }, [citySearch])

    const filteredChefs = useMemo(() => {
        return chefs.filter(chef => chef.toLowerCase().includes(chefSearch.toLowerCase()))
    }, [chefSearch])

    const filteredKitchens = useMemo(() => { 
        return kitchens.filter(kitchen => kitchen.toLowerCase().includes(kitchenSearch.toLowerCase()))
    })

    const handleCityToggle = (city) => {
        setSelectedCities(prev =>
            prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
        )
    }

    const handleChefToggle = (chef) => {
        setSelectedChefs(prev =>
            prev.includes(chef) ? prev.filter(c => c !== chef) : [...prev, chef]
        )
    }

    const handleKitchenToggle = (kitchen) => { 
        setSelectedKitchens(prev => 
            prev.includes(kitchen) ? prev.filter(k => k !== kitchen) : [...prev, kitchen]
        )
    }

    const getUrl = () => { 
        let url = ''
        if (searchQuery) {
            url += `&search=${searchQuery}`
        }
        if (selectedCities.length > 0) {
            url += `&city=${selectedCities.join(',')}`
        }
        if (selectedChefs.length > 0) {
            url += `&chef=${selectedChefs.join(',')}`
        }
        if (selectedKitchens.length > 0) {
            url += `&kitchen=${selectedKitchens.join(',')}`
        }
        if (priceRange[0] !== 0 || priceRange[1] !== 100) {
            url += `&price=${priceRange.join(',')}`
        }
        if (rating > 0) {
            url += `&rating=${rating}`
        }
        if (sortOption !== 'default') {
            url += `&sort=${sortOption}`
        }
        url += `&page=${0}`
        if (url.startsWith('&')) {
            url = url.replace('&', '?')
        }
        return url
    }
    
    const nextPageUrl = () => { 
        let url = ''
        if (searchQuery) {
            url += `&search=${searchQuery}`
        }
        if (selectedCities.length > 0) {
            url += `&city=${selectedCities.join(',')}`
        }
        if (selectedChefs.length > 0) {
            url += `&chef=${selectedChefs.join(',')}`
        }
        if (selectedKitchens.length > 0) {
            url += `&kitchen=${selectedKitchens.join(',')}`
        }
        if (priceRange[0] !== 0 || priceRange[1] !== 100) {
            url += `&price=${priceRange.join(',')}`
        }
        if (rating > 0) {
            url += `&rating=${rating}`
        }
        if (sortOption !== 'default') {
            url += `&sort=${sortOption}`
        }
        if (searchQ.get('page')) {
            url += `&page=${Number(searchQ.get('page')) + 1}`
        }
        else
        {
            url += `&page=${1}`
        }
        if (url.startsWith('&')) {
            url = url.replace('&', '?')
        }
        return url
    }

    const prevPageUrl = () => {
        let url = ''
        if (searchQuery) {
            url += `&search=${searchQuery}`
        }
        if (selectedCities.length > 0) {
            url += `&city=${selectedCities.join(',')}`
        }
        if (selectedChefs.length > 0) {
            url += `&chef=${selectedChefs.join(',')}`
        }
        if (selectedKitchens.length > 0) {
            url += `&kitchen=${selectedKitchens.join(',')}`
        }
        if (priceRange[0] !== 0 || priceRange[1] !== 100) {
            url += `&price=${priceRange.join(',')}`
        }
        if (rating > 0) {
            url += `&rating=${rating}`
        }
        if (sortOption !== 'default') {
            url += `&sort=${sortOption}`
        }
        if (searchQ.get('page')) {
            url += `&page=${Number(searchQ.get('page')) - 1}`
        }
        else {
            url += `&page=${0}`
        }
        if (url.startsWith('&')) {
            url = url.replace('&', '?')
        }
        return url
    }

    const PreviousPageVisible = () => { 
        if (searchQ.get('page')) {
            if (Number(searchQ.get('page')) > 0) {
                return ''
            }
            else
            {
                return 'hidden'
            }
        }
        else
        {
            return 'hidden'
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search for food..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                        }}
                        className="pl-10"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Link href={`/search?search=${searchQuery}`} className={` absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground`}>
                        Search
                    </Link>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4 space-y-6">
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">Sort By</h3>
                            <Select onValueChange={setSortOption} defaultValue={sortOption}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select sorting option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="price-high-to-low">Price: High to Low</SelectItem>
                                    <SelectItem value="price-low-to-high">Price: Low to High</SelectItem>
                                    <SelectItem value="rating-high-to-low">Rating: High to Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-between">
                                <h3 className="font-semibold mb-2">Cities</h3>
                                <button onClick={() => setSelectedCities([])} className={`text-sm font-medium ${selectedCities.length === 0 ? 'text-gray-500' : 'text-yellow-400'}`}>Clear All</button>
                            </div>
                            <Input
                                type="text"
                                placeholder="Search cities..."
                                value={citySearch}
                                onChange={(e) => setCitySearch(e.target.value)}
                                className="mb-2"
                            />
                            <ScrollArea className="h-40">
                                {filteredCities.map((city) => (
                                    <div key={city} className="flex items-center space-x-2 mb-2">
                                        <Checkbox
                                            id={`city-${city}`}
                                            checked={selectedCities.includes(city)}
                                            onCheckedChange={() => handleCityToggle(city)}
                                        />
                                        <label htmlFor={`city-${city}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{city}</label>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className='flex justify-between'>
                                <h3 className="font-semibold mb-2">Kitchen</h3>
                                <button onClick={() => setSelectedKitchens([])} className={`text-sm font-medium ${selectedKitchens.length === 0 ? 'text-gray-500' : 'text-red-500'}`}>Clear All</button>
                            </div>
                            <Input
                                type="text"
                                placeholder="Search cities..."
                                value={kitchenSearch}
                                onChange={(e) => setKitchenSearch(e.target.value)}
                                className="mb-2"
                            />
                            <ScrollArea className="h-40">
                                {filteredKitchens.map((kitchen) => (
                                    <div key={kitchen} className="flex items-center space-x-2 mb-2">
                                        <Checkbox
                                            id={`kitchen-${kitchen}`}
                                            checked={selectedKitchens.includes(kitchen)}
                                            onCheckedChange={() => handleKitchenToggle(kitchen)}
                                        />
                                        <label htmlFor={`kitchen-${kitchen}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{kitchen}</label>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className='flex justify-between'>
                                <h3 className="font-semibold mb-2">Chef</h3>
                                <button onClick={() => setSelectedChefs([])} className={`text-sm font-medium ${selectedChefs.length === 0 ? 'text-gray-500' : 'text-red-500'}`}>Clear All</button>
                            </div>
                            <Input
                                type="text"
                                placeholder="Search chefs..."
                                value={chefSearch}
                                onChange={(e) => setChefSearch(e.target.value)}
                                className="mb-2"
                            />
                            <ScrollArea className="h-40">
                                {filteredChefs.map((chef) => (
                                    <div key={chef} className="flex items-center space-x-2 mb-2">
                                        <Checkbox
                                            id={`chef-${chef}`}
                                            checked={selectedChefs.includes(chef)}
                                            onCheckedChange={() => handleChefToggle(chef)}
                                        />
                                        <label htmlFor={`chef-${chef}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{chef}</label>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">Price Range</h3>
                            <Slider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                max={tempPrice[1]}
                                step={1}
                                className="mb-2"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>৳{priceRange[0]}</span>
                                <span>৳{priceRange[1]}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className='flex justify-between'>
                                <h3 className="font-semibold mb-2">Rating</h3>
                                <button onClick={() => setRating(0)} className={`text-sm font-medium ${rating === 0 ? 'text-yellow-400' : 'text-gray-500'}`}>Clear All</button>
                            </div>
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    {/* corresponding value will be added like this: search__{query} */}
                    <Link className={buttonVariants("default")} href={`/search${getUrl()}`}>Search</Link>
                </div>

                <div className="w-full md:w-3/4">
                    {props.children}
                    <div className='grid place-content-center'>
                        <div className='grid place-content-center grid-cols-2 w-fit gap-6'>
                            <Link href={`/search${prevPageUrl()}`} className={`${buttonVariants("outline")} ${PreviousPageVisible()} bg-background border-input border hover:bg-input text-foreground m-2 hover:text-background w-5`}>
                                <ChevronLeftIcon className="h-4 w-4" />
                            </Link>
                            <Link href={`/search${nextPageUrl()}`} className={`${buttonVariants("outline")} bg-background border-input border hover:bg-input text-foreground m-2 hover:text-background w-5`}>
                                <ChevronRightIcon className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
                
            </div>
           
            
        </div>
    )
}