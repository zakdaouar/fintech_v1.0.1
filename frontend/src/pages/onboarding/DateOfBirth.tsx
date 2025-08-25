import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/DateOfBirth.client.tsx'), { ssr: false });
export default Page;