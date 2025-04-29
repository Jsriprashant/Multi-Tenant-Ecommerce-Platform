interface props {
    data: object
}

export const Categories = ({ data }: props) => {
    return (
        <div>
            {
                JSON.stringify(data, null, 2)
            }
        </div>
    )
}

// function categories({ data }: props) {
//     return (
//         <div>

//         </div>
//     )
// }

// export default categories
