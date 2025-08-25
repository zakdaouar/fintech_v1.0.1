import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../../spa/onboarding/IdvIntro.client.tsx'), { ssr: false });
export default Page;