import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
const navigation = [


  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },


  { name: 'Transfers', href: '/transfers', icon: ArrowLeftRight },


  { name: 'Issue Credit Card', href: '/issue-card', icon: CreditCard },


  { name: 'Customers', href: '/customers', icon: Wallet },


];





export const Sidebar = () => {


  return (


    <div className="w-64 bg-gradient-card border-r border-border flex flex-col">


      {/* Logo */}


      <div className="p-6 border-b border-border">


        <div className="flex items-center gap-3">


          <div className="p-2 rounded-lg bg-gradient-primary">


            <Wallet className="h-6 w-6 text-white" />


          </div>


          <div>


            <h1 className="text-xl font-bold">Remoove</h1>


            <p className="text-sm text-muted-foreground">Dashboard</p>


          </div>


        </div>


      </div>





      {/* Navigation */}


      <nav className="flex-1 p-4">


        <ul className="space-y-2">


          {navigation.map((item) => (


            <li key={item.name}>


              <Link href={item.href}


                className={({ isActive }) =>


                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${


                    isActive


                      ? 'bg-primary text-primary-foreground shadow-lg'


                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'


                  }`


                }


              >


                <item.icon className="h-5 w-5" />


                {item.name}


              </Link>


            </li>


          ))}


        </ul>


      </nav>





      {/* User Profile */}


      <div className="p-4 border-t border-border">


        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">


          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">


            <span className="text-sm font-medium text-white">JD</span>


          </div>


          <div className="flex-1 min-w-0">


            <p className="text-sm font-medium truncate">John Doe</p>


            <p className="text-xs text-muted-foreground truncate">john@example.com</p>


          </div>


        </div>


      </div>


    </div>


  );


};