import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./Overview.client'), { ssr: false });
export default Page;