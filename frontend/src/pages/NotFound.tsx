import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../spa/NotFound.client.tsx'), { ssr: false });
export default Page;