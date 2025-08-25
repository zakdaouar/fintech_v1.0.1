import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/ConfirmEmail.client.tsx'), { ssr: false });
export default Page;