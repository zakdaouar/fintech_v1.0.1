import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./ContactDetails.client'), { ssr: false });
export default Page;