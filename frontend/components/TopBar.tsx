import Link from 'next/link';


import { useRouter } from 'next/router';


/* eslint-disable react/no-unescaped-entities */
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const TopBar = () => {


  const router = useRouter();


  return (


    <div className="h-16 bg-gradient-card border-b border-border px-6 flex items-center justify-between" role="banner">


      <div>


        <h2 className="text-xl font-semibold">Welcome back, John</h2>


        <p className="text-sm text-muted-foreground">


          Here's what's happening with your account today.


        </p>


      </div>





      <div className="flex items-center gap-4">


        {/* Notifications */}


        <Button variant="ghost" size="icon" className="relative">


          <Bell className="h-5 w-5" />


          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-white">


            3


          </span>


        </Button>





        {/* User Dropdown */}


        <DropdownMenu>


          <DropdownMenuTrigger asChild>


            <Button variant="ghost" className="flex items-center gap-2">


              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">


                <span className="text-sm font-medium text-white">JD</span>


              </div>


              <span className="hidden md:block">John Doe</span>


            </Button>


          </DropdownMenuTrigger>


          <DropdownMenuContent align="end" className="w-56">


            <DropdownMenuItem>


              <User className="mr-2 h-4 w-4" />


              Profile


            </DropdownMenuItem>


            <DropdownMenuItem>


              <Settings className="mr-2 h-4 w-4" />


              Settings


            </DropdownMenuItem>


            <DropdownMenuItem className="text-destructive" onSelect={() => router.push("/")}>


              <LogOut className="mr-2 h-4 w-4" />


              Sign out


            </DropdownMenuItem>


          </DropdownMenuContent>


        </DropdownMenu>


      </div>


    </div>


  );


};