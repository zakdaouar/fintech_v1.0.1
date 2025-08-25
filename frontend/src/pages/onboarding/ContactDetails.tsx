import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/ContactDetails.client.tsx'), { ssr: false });
export default Page;