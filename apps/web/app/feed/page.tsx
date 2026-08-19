import { FeedPage } from "../../src/features/feed/components/feed-page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function FeedRoute() {
  return <FeedPage />;
}
