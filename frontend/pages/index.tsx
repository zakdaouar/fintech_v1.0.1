import dynamic from 'next/dynamic';


import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'next/link';
import { Globe, Shield, TrendingUp, Wallet } from 'lucide-react';
const Index = () => {


  const navigate = useRouter();


  





  return (


    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">


      <div className="max-w-4xl mx-auto text-center">


        {/* Hero Section */}


        <div className="mb-12">


          <div className="mb-6">


            <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-primary mb-4">


              <Wallet className="h-8 w-8 text-white" />


            </div>


            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">


              Next-Gen Banking


            </h1>


            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">


              Experience the future of finance with our secure, intelligent, and globally connected platform. 


              Manage your money with confidence.


            </p>


          </div>





          {/* CTA Buttons */}


          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">


            <Button 


              size="lg" 


              className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-xl-custom"


              onClick={() => router.push('/dashboard')}


            >


              Login to Dashboard


            </Button>


            <Button 


              size="lg" 


              variant="outline" 


              className="border-primary/30 hover:bg-primary/10 font-semibold px-8 py-6 text-lg rounded-xl"


              onClick={() => router.push('/onboarding/start')}


            >


              Register Now


            </Button>


          </div>


        </div>





        {/* Feature Cards */}


        <div className="grid md:grid-cols-3 gap-6">


          <Card className="p-6 bg-gradient-card border-border shadow-card hover:shadow-lg-custom transition-all duration-300">


            <Shield className="h-10 w-10 text-primary mb-4 mx-auto" />


            <h3 className="text-lg font-semibold mb-2">Bank-Grade Security</h3>


            <p className="text-muted-foreground">Your funds are protected with enterprise-level encryption and multi-factor authentication.</p>


          </Card>


          


          <Card className="p-6 bg-gradient-card border-border shadow-card hover:shadow-lg-custom transition-all duration-300">


            <TrendingUp className="h-10 w-10 text-accent mb-4 mx-auto" />


            <h3 className="text-lg font-semibold mb-2">Smart Analytics</h3>


            <p className="text-muted-foreground">Get insights into your spending patterns and optimize your financial decisions.</p>


          </Card>


          


          <Card className="p-6 bg-gradient-card border-border shadow-card hover:shadow-lg-custom transition-all duration-300">


            <Globe className="h-10 w-10 text-success mb-4 mx-auto" />


            <h3 className="text-lg font-semibold mb-2">Global Reach</h3>


            <p className="text-muted-foreground">Send money worldwide with competitive rates and instant transfers.</p>


          </Card>


        </div>


      </div>


    </div>


  );


};





export default dynamic(() => Promise.resolve(Index), { ssr: false });

