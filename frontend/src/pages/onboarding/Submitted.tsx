import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./Submitted.client'), { ssr: false });
export default Page;