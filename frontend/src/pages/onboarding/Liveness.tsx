import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./Liveness.client'), { ssr: false });
export default Page;