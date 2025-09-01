import * as React from "react"


import { cva, type VariantProps } from '@/lib/shims/cva'





import { cn } from "@/lib/utils"
import { HTMLDivElement, HTMLHeadingElement, HTMLParagraphElement } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

const alertVariants = cva(


  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",


  {


    variants: {


      variant: {


        default: "bg-background text-foreground",


        destructive:


          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",


      },


    },


    defaultVariants: {


      variant: "default",


    },


  }


)





const Alert = React.forwardRef<





  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>


>(({ className, variant, ...props }, ref) => (


  <div


    ref={ref}


    role="alert"


    className={cn(alertVariants({ variant }), className)}


    {...props}


  />


))


Alert.displayName = "Alert"





const AlertTitle = React.forwardRef<





  React.HTMLAttributes<HTMLHeadingElement>


>(({ className, ...props }, ref) => (


  <h5


    ref={ref}


    className={cn("mb-1 font-medium leading-none tracking-tight", className)}


    {...props}


  />


))


AlertTitle.displayName = "AlertTitle"





const AlertDescription = React.forwardRef<





  React.HTMLAttributes<HTMLParagraphElement>


>(({ className, ...props }, ref) => (


  <div


    ref={ref}


    className={cn("text-sm [&_p]:leading-relaxed", className)}


    {...props}


  />


))


AlertDescription.displayName = "AlertDescription"





export { Alert, AlertTitle, AlertDescription }


