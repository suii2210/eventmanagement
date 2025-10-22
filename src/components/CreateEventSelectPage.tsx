import { useNavigate } from "react-router-dom";
import { X, Pencil, Sparkles } from "lucide-react";
import { createNewDraftId } from "../contexts/EventDraftContext"; // ✅ Make sure this import is added

export default function CreateEventSelectPage() {
  const nav = useNavigate();

  const goManual = () => {
    const id = createNewDraftId();
    nav(`/create/${id}/build`); // ✅ goes to Build event page with sidebar
  };

  const goAI = () => {
    const id = createNewDraftId();
    nav(`/create/${id}/ai`); // ✅ goes to AI event creation page
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => nav(-1)}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Title */}
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          How do you want to build your event?
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Manual Creation */}
          <button
            onClick={goManual}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-gray-200 p-6 text-center transition-all hover:border-orange-500 hover:shadow-md"
          >
            <div className="rounded-full bg-orange-50 p-3 group-hover:bg-orange-100">
              <Pencil className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-lg font-semibold text-gray-800">Start from scratch</div>
            <p className="text-sm text-gray-500">
              Add event details, create tickets, and set schedules manually.
            </p>
          </button>

          {/* AI Creation */}
          <button
            onClick={goAI}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-gray-200 p-6 text-center transition-all hover:border-orange-500 hover:shadow-md"
          >
            <div className="rounded-full bg-orange-50 p-3 group-hover:bg-orange-100">
              <Sparkles className="h-8 w-8 text-orange-600" />
            </div>
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
