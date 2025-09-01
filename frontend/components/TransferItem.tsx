import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, getStatusColor } from "@/utils/formatters";


import type { Transfer } from "@/utils/api";
import { ArrowUpRight } from 'lucide-react';
interface TransferItemProps {


  transfer: Transfer;


}





export const TransferItem = ({ transfer }: TransferItemProps) => {


  return (


    <Card className="p-4 bg-gradient-card border-border hover:border-primary/30 transition-all duration-300">


      <div className="flex items-center justify-between">


        <div className="flex items-center gap-4">


          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">


            <ArrowUpRight className="h-4 w-4 text-primary" />


          </div>


          <div>


            <div className="font-medium">{transfer.to}</div>


            <div className="text-sm text-muted-foreground">


              {transfer.date && formatDate(transfer.date)}


            </div>


          </div>


        </div>


        


        <div className="text-right">


          <div className="font-semibold">


            -{formatCurrency(transfer.amount, transfer.currency)}


          </div>


          <Badge 


            variant="secondary" 


            className={`${getStatusColor(transfer.status || 'pending')} text-xs`}


          >


            {transfer.status || 'Pending'}


          </Badge>


        </div>


      </div>


    </Card>


  );


};