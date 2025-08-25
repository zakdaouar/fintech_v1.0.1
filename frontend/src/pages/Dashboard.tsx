import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../spa/Dashboard.client.tsx'), { ssr: false });
export default Page;