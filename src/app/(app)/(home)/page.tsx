// 'use client'
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function Home() {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'categories',
  })
  return (
    <div>
      {
        JSON.stringify(data, null, 2)
      }

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

