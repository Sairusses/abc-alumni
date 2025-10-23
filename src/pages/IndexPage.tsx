import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "🎓 Alumni",
      description: "Manage alumni profiles and academic details.",
      path: "/alumni",
      color: "bg-blue-500",
    },
    {
      title: "💼 Work History",
      description: "Track alumni employment records and experiences.",
      path: "/work-history",
      color: "bg-green-500",
    },
    {
      title: "📅 Events",
      description: "View and manage alumni events and gatherings.",
      path: "/events",
      color: "bg-purple-500",
    },
    {
      title: "🗣️ Participation",
      description: "Record alumni participation in events and activities.",
      path: "/participation",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        🎓 ABC Alumni Database
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl">
        {sections.map((section) => (
          <Card
            key={section.title}
            className="hover:shadow-lg transition-all duration-200 border border-gray-200"
          >
            <CardHeader
              className={`text-white ${section.color} p-4 rounded-t-lg`}
            >
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </CardHeader>
            <CardBody className="p-5">
              <p className="text-gray-600 mb-4">{section.description}</p>
              <Button color="primary" onPress={() => navigate(section.path)}>
                Open
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} ABC Alumni Database | Built with HeroUI +
        SQL.js
      </footer>
    </div>
  );
}
