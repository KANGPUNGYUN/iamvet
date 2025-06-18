import { Button } from "@/components/ui/Button";
import { EditIcon, PlusIcon } from "public/icons";

export default function HomePage() {
  return (
    <div>
      <h1 className="font-title title-bold">IAMVET 홈페이지</h1>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">L 크기 버튼</h3>
        <div className="flex gap-4">
          <Button size="large" variant="default">
            Button
          </Button>
          <Button size="large" variant="line">
            Button
          </Button>
          <Button size="large" variant="disable">
            Button
          </Button>
        </div>
      </div>

      {/* M 크기 버튼들 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">M 크기 버튼</h3>
        <div className="flex gap-4">
          <Button size="medium" variant="keycolor">
            Button
          </Button>
          <Button size="medium" variant="default">
            Button
          </Button>
          <Button size="medium" variant="line">
            Button
          </Button>
          <Button size="medium" variant="disable">
            Button
          </Button>
        </div>
      </div>

      {/* S 크기 버튼들 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">S 크기 버튼</h3>
        <div className="flex gap-4">
          <Button size="small" variant="keycolor">
            Button
          </Button>
          <Button size="small" variant="default">
            Button
          </Button>
          <Button size="small" variant="line">
            Button
          </Button>
          <Button size="small" variant="disable">
            Button
          </Button>
        </div>
      </div>

      {/* XS 크기 버튼들 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">XS 크기 버튼</h3>
        <div className="flex gap-4">
          <Button size="xsmall" variant="default">
            Button
          </Button>
          <Button size="xsmall" variant="line">
            Button
          </Button>
          <Button size="xsmall" variant="weak">
            Button
          </Button>
        </div>
      </div>

      {/* 아이콘 버튼들 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">아이콘 버튼</h3>
        <div className="flex gap-4 items-center">
          <Button
            buttonType="icon-web"
            device="web"
            icon={<EditIcon currentColor="white" />}
          >
            Button
          </Button>
          <Button
            buttonType="icon-app"
            device="app"
            icon={<EditIcon currentColor="white" />}
          />
        </div>
      </div>

      {/* 더보기 버튼 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">더보기 버튼</h3>
        <Button
          buttonType="more"
          icon={<PlusIcon currentColor="#9098A4" />}
          iconPosition="left"
        >
          더보기
        </Button>
      </div>
    </div>
  );
}
