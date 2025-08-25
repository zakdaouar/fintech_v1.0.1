import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/Review.client.tsx'), { ssr: false });
export default Page;