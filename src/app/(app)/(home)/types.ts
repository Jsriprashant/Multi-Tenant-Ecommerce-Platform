import { Category } from "@/payload-types";

export type CustomCategory = Category & {
    subcategories: Category[]
}

// when we were using Category as a type in our component then we were getting an error that subcategories is not a property of Category
// so we created a new type CustomCategory which is extending the Category type and adding subcategories as an empty array
// and then we used this type in our components