export default async function TalentManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>인재정보 상세 관리: {id}</div>;
}
