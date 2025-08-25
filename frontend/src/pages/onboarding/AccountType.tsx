import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./AccountType.client'), { ssr: false });
export default Page;