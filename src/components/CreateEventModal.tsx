import { useNavigate } from "react-router-dom";
import { X, Pencil, Sparkles } from "lucide-react";

export default function CreateEventSelectPage() {
  const nav = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-8 relative shadow-lg">
        <button
          onClick={() => nav(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          How do you want to build your event?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => nav("/create/manual")}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-md transition-all flex flex-col items-center gap-3 text-center"
          >
            <Pencil className="w-8 h-8 text-orange-600" />
            <div className="text-lg font-semibold text-gray-800">Start from scratch</div>
            <p className="text-sm text-gray-500">
              Add event details, create tickets, set schedules.
            </p>
          </button>

          <button
            onClick={() => nav("/create/ai")}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-md transition-all flex flex-col items-center gap-3 text-center"
          >
            <Sparkles className="w-8 h-8 text-orange-600" />
            <div className="text-lg font-semibold text-gray-800">Create with AI</div>
            <p className="text-sm text-gray-500">
              Answer a few prompts and generate an event instantly.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
