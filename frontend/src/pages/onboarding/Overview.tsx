import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/Overview.client.tsx'), { ssr: false });
export default Page;