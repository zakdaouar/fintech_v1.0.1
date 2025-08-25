import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./DateOfBirth.client'), { ssr: false });
export default Page;