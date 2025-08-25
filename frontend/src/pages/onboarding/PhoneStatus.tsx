import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/PhoneStatus.client.tsx'), { ssr: false });
export default Page;