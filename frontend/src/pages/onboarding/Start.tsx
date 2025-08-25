import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/Start.client.tsx'), { ssr: false });
export default Page;