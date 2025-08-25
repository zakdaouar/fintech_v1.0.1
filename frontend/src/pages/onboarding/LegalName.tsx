import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./LegalName.client'), { ssr: false });
export default Page;