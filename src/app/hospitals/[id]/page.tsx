export default function HospitalDetailPage({ params }: { params: { id: string } }) {
  return <div>병원 상세: {params.id}</div>;
}