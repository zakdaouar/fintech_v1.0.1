import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./ConfirmEmail.client'), { ssr: false });
export default Page;