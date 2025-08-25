import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./Customers.client'), { ssr: false });
export default Page;