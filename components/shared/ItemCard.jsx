import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import Image from "next/image";

export function ItemCard({ itemName, date, price, img }) {
  return (
    <Card className="w-[280px] h-auto my-4 shadow-md cursor-pointer hover:shadow-2xl transition">
    <CardHeader className="h-[180px] w-full overflow-hidden">
      <Image 
        src={img} 
        alt={itemName}
        width={280} 
        height={180}
        objectFit="contain" 
        className="rounded-md"
      />
    </CardHeader>
    <CardContent className="h-[80px] py-2"> {/* Further reduced height */}
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-row justify-between px-2">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-xl overflow-hidden text-ellipsis whitespace-nowrap">
              {itemName}
            </p>
            <p className="text-base font-medium">Price: <span className="font-bold">{price}</span></p>
          </div>
          <p className="font-medium text-sm">{new Date(date).toLocaleDateString()}</p>
        </div>
      </div>
    </CardContent>
    <CardFooter className="h-[30px] flex justify-between"> {/* Optionally reduce this height or remove if not needed */}
    </CardFooter>
</Card>
  );
}

// {new Date(date).toLocaleDateString()}