import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./Tests.client'), { ssr: false });
export default Page;