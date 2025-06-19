export default async function HospitalMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>메시지 상세: {id}</div>;
}
