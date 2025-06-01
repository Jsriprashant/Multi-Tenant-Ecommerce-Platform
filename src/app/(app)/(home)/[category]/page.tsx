
// when eveer we click on a category it will go to http://localhost:3000/drawing-painting

import React from 'react'

interface Props {
    params: Promise<{ category: string }>

    // we will extract the category (drawing-painting) from url http://localhost:3000/drawing-painting and then display it 
}

//  http://localhost:3000/drawing-painting
//  http://localhost:3000/{category}


async function Page({ params }: Props) {
    const { category } = await params

    // destructuring the category from await params


    return (
        <div>
            Category : {category}
        </div>
    )
}

export default Page
