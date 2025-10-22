import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

type Draft = {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  status: "draft" | "published";
  eventId?: string; // The actual event ID from the database
};

type Ctx = {
  draft: Draft;
  setTitle: (s: string) => void;
  setDate: (s: string) => void;
  setStatus: (s: Draft["status"]) => void;
  setEventId: (eventId: string) => void;
  saveToStorage: () => void;
};

const EventDraftContext = createContext<Ctx | undefined>(undefined);

export function EventDraftProvider({ children }: { children: React.ReactNode }) {
  const { draftId } = useParams();

  // Create / load a draft with this id
  const [draft, setDraft] = useState<Draft>(() => {
    const k = `draft:${draftId}`;
    const stored = k ? localStorage.getItem(k) : null;
    if (stored) return JSON.parse(stored) as Draft;
    return {
      id: draftId || crypto.randomUUID(),
      title: "Event Title",
      date: "",
      status: "draft",
    };
  });

  useEffect(() => {
    if (!draftId) return;
    localStorage.setItem(`draft:${draftId}`, JSON.stringify(draft));
  }, [draft, draftId]);

  const api = useMemo<Ctx>(() => ({
    draft,
    setTitle: (title) => setDraft((d) => ({ ...d, title })),
    setDate: (date) => setDraft((d) => ({ ...d, date })),
    setStatus: (status) => setDraft((d) => ({ ...d, status })),
    setEventId: (eventId) => setDraft((d) => ({ ...d, eventId })),
    saveToStorage: () => {
      if (!draft.id) return;
      localStorage.setItem(`draft:${draft.id}`, JSON.stringify(draft));
    },
  }), [draft]);

  return (
    <EventDraftContext.Provider value={api}>
      {children}
    </EventDraftContext.Provider>
  );
}

export function useEventDraft() {
  const ctx = useContext(EventDraftContext);
  if (!ctx) throw new Error("useEventDraft must be used inside EventDraftProvider");
  return ctx;
}

/** helper to create a new draft id and seed storage */
export function createNewDraftId() {
  const id = crypto.randomUUID();
  const seed: Draft = { id, title: "Event Title", date: "", status: "draft" };
  localStorage.setItem(`draft:${id}`, JSON.stringify(seed));
  return id;
}
