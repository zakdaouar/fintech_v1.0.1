import dynamic from 'next/dynamic';
const Page = dynamic(() => import('./IssueCard.client'), { ssr: false });
export default Page;