import { cn } from "@/lib/utils"
import { HTMLDivElement } from 'lucide-react';
function Skeleton({


  className,


  ...props


}: React.HTMLAttributes<HTMLDivElement>) {


  return (


    <div


      className={cn("animate-pulse rounded-md bg-muted", className)}


      {...props}


    />


  )


}





export { Skeleton }
