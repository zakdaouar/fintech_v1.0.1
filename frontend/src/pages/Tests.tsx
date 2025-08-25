import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../spa/Tests.client.tsx'), { ssr: false });
export default Page;