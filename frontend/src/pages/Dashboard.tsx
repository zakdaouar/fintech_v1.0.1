import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./Dashboard.client'), { ssr: false });
export default Page;