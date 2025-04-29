// 'use client'
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'

export default async function Home() {
  // const payload = await getPayload({
  //   config: configPromise,
  // })

  // const data = await payload.find({
  //   collection: 'categories',
  //   // in the fronetend we need to show only the main categories
  //   // so while getting the data we add a filter or where condition to get only the main categories
  //   // in the 'where' we are checking if the parent field is empty or not
  //   //if yes then only the category is stored in 'data' variable
  //   where: {
  //     parent: {
  //       exists: false
  //     }
  //   }
  // })
  return (
    <div>
Home Page
    </div>
    // <div className="flex flex-col gap-y-4 p-1 m-1">
    //   <div>

    //     <Button variant={"elevated"}> Hello World</Button>
    //   </div>
    //   <Input placeholder="Enter something"></Input>
    //   <Progress value={50}></Progress>
    //   <Textarea placeholder=" INput text here " onChange={(e) => { console.log(e.target.value) }}></Textarea>
    //   <Checkbox></Checkbox>

    // </div>



  );
}
// moved page.tsx from src/app/page.tsx to src/app/(home)/page.tsx

