'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4 p-1 m-1">
      <div>

      <Button variant={"elevated"}> Hello World</Button>
      </div>
      <Input placeholder="Enter something"></Input>
      <Progress value={50}></Progress>
      <Textarea placeholder=" INput text here " onChange={(e) => { console.log(e.target.value) }}></Textarea>

    </div>
  );
}
