import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./ComplianceLocale.client'), { ssr: false });
export default Page;