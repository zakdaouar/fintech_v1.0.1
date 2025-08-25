import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/DocumentSetup.client.tsx'), { ssr: false });
export default Page;