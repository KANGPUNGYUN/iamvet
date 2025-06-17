export default function LectureDetailPage({ params }: { params: { id: string } }) {
  return <div>강의영상 상세: {params.id}</div>;
}