import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../spa/Transfers.client.tsx'), { ssr: false });
export default Page;