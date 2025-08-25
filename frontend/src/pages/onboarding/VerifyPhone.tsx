import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./VerifyPhone.client'), { ssr: false });
export default Page;