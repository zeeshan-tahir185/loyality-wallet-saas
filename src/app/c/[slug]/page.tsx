import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { CustomerCard } from "./customer-card";

async function Card({ params }: { params: PageProps<"/c/[slug]">["params"] }) {
  const { slug } = await params;
  return <CustomerCard slug={slug} />;
}

export default function Page({ params }: PageProps<"/c/[slug]">) {
  return (
    <Suspense fallback={<Loading />}>
      <Card params={params} />
    </Suspense>
  );
}
