

import { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
    minPrice?: string | null,
    maxPrice?: string | null,
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;

}

export const formatAsCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");

    const parts = numericValue.split(".")
    const formattedValue = parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : "")
    // ensures decimal points looks correct
    if (!formattedValue) return "";

    const numberValue = parseFloat(formattedValue)

    if (isNaN(numberValue)) return ""

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numberValue)

}

export const PriceFilter = ({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }: Props) => {

    const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        // get raw input value and extract only numeric values
        const numericValue = e.target.value.replace(/[^0-9.]/g, "")
        onMinPriceChange(numericValue)
    }

    const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9.]/g, "")
        onMaxPriceChange(numericValue)
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <Label className="font-medium text-base">
                    Minimum Price
                </Label>
                <Input onChange={handleMinPriceChange} type="text" placeholder="$0" value={minPrice ? formatAsCurrency(minPrice) : ""} />
            </div>
            <div className="flex flex-col gap-2">
                <Label className="font-medium text-base">
                    Maximum Price
                </Label>
                <Input onChange={handleMaxPriceChange} type="text" placeholder="∞" value={maxPrice ? formatAsCurrency(maxPrice) : ""} />
            </div>

        </div>

    )

}
