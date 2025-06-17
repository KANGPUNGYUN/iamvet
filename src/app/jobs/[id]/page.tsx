export default function JobDetailPage({ params }: { params: { id: string } }) {
  return <div>채용공고 상세: {params.id}</div>;
}