import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./PhoneStatus.client'), { ssr: false });
export default Page;