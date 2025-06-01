
// when eveer we click on a category it will go to http://localhost:3000/drawing-painting

import React from 'react'

interface Props {
    params: Promise<{ category: string, subcategory: string }>

    // we will extract the category (drawing-painting) from url http://localhost:3000/drawing-painting and then display it 
}

async function Page({ params }: Props) {
    const { category, subcategory } = await params

    // destructuring the category from await params

    // http://localhost:3000/education/test-preparation
    // http://localhost:3000/{category}/{subcategory}

    return (
        <div>
            Category : {category} <br />
            SubCategory: {subcategory}
        </div>
    )
}

export default Page
