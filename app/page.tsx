
import Header from "@/app/components/header"
import Form from "@/app/components/form"
import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div className="">
      <Header></Header>

      <div className="p-10">
        <div className="max-w-[60px] w-[100%] text-[64px] font-mono mt-[48px] sm:text-[50px]">
          <h1>Connecting Today</h1>
        </div>
        <div className="mt-28">
          <Form></Form>
        </div>
        
      </div>
      
    </div>
  );
}
