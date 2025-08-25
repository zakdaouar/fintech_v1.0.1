import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/Liveness.client.tsx'), { ssr: false });
export default Page;