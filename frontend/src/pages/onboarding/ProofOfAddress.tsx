import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./ProofOfAddress.client'), { ssr: false });
export default Page;