import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/AccountType.client.tsx'), { ssr: false });
export default Page;