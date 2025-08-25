import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./DocumentSetup.client'), { ssr: false });
export default Page;