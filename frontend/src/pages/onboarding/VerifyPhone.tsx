import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/VerifyPhone.client.tsx'), { ssr: false });
export default Page;