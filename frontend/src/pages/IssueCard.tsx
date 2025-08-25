import dynamic from 'next/dynamic';
const Page = dynamic(() => import('../../spa/IssueCard.client.tsx'), { ssr: false });
export default Page;