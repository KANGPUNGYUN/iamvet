export default function HospitalMessageDetailPage({ params }: { params: { id: string } }) {
  return <div>메시지 상세: {params.id}</div>;
}