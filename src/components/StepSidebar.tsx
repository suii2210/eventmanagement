import { NavLink, useParams } from "react-router-dom";
import { useEventDraft } from "../contexts/EventDraftContext";

export default function StepSidebar() {
  const { draft } = useEventDraft();
  const { draftId } = useParams();

  return (
    <aside className="border-r bg-gray-50/60 px-4 py-6 lg:min-h-[calc(100vh-64px)] w-full max-w-[280px]">
      <button className="mb-4 text-sm text-blue-600 hover:underline" onClick={() => history.back()}>
        &larr; Back to events
      </button>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-4 border-b">
          <div className="text-lg font-semibold">{draft.title || "Event Title"}</div>
          <div className="mt-1 text-sm text-gray-600">{draft.date ? new Date(draft.date).toDateString() : "Pick a date"}</div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm">
            <span className={`inline-block h-2 w-2 rounded-full ${draft.status === "draft" ? "bg-gray-400" : "bg-green-500"}`} />
            {draft.status === "draft" ? "Draft" : "Published"}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <StepLink to={`/create/${draftId}/build`} label="Build event page" activeClass="ring-2 ring-blue-500" />
          <StepLink to={`/create/${draftId}/tickets`} label="Add tickets" />
          <StepLink to={`/create/${draftId}/publish`} label="Publish" />
        </div>
      </div>
    </aside>
  );
}

function StepLink({ to, label, activeClass = "" }: { to: string; label: string; activeClass?: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded-lg border bg-white px-4 py-3 transition hover:border-gray-300 ${
          isActive ? `border-blue-500 bg-blue-50 ${activeClass}` : "border-gray-200"
        }`
      }
    >
      <div className="flex items-center gap-3">
        <span className={`inline-block h-3 w-3 rounded-full ${/* blue dot only if active */ ""}`} />
        <div className="font-medium">{label}</div>
      </div>
      <p className="mt-1 text-xs text-gray-600">
        {label === "Build event page" ? "Add all your event details and let attendees know what to expect" :
         label === "Add tickets" ? "Create ticket types and pricing" :
         "Get your event ready to go live"}
      </p>
    </NavLink>
  );
}
