import { Card } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <h1 className="text-4xl font-bold mb-10 dark:text-gray-100 text-center">
        ABC Alumni Database
      </h1>

      <div className="grid grid-cols-4 gap-6 w-full h-40">
        <Card
          isPressable
          className="justify-center text-xl font-semibold dark:text-gray-100 dark:bg-[#1A1A1A]"
          onPress={() => navigate("/alumni")}
        >
          Alumni
        </Card>

        <Card
          isPressable
          className="justify-center text-xl font-semibold dark:text-gray-100 dark:bg-[#1A1A1A]"
          onPress={() => navigate("/work-history")}
        >
          Work History
        </Card>

        <Card
          isPressable
          className="justify-center text-xl font-semibold dark:text-gray-100 dark:bg-[#1A1A1A]"
          onPress={() => navigate("/events")}
        >
          Events
        </Card>

        <Card
          isPressable
          className="justify-center text-xl font-semibold dark:text-gray-100  dark:bg-[#1A1A1A]"
          onPress={() => navigate("/participation")}
        >
          Participation
        </Card>
      </div>
    </div>
  );
}
