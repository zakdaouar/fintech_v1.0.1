import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./Start.client'), { ssr: false });
export default Page;