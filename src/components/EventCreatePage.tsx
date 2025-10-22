import { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Camera, Plus } from "lucide-react";

type Form = {
  title: string;
  summary: string; // 140 char max
  description: string; // HTML from Quill
  date: string; // yyyy-mm-dd
  startTime: string; // hh:mm
  endTime: string; // hh:mm
  location: string;
};

const SUMMARY_MAX = 140;

export default function EventCreatePage() {
  const [form, setForm] = useState<Form>({
    title: "",
    summary: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const [cover, setCover] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const summaryCount = useMemo(
    () => `${form.summary.length} / ${SUMMARY_MAX}`,
    [form.summary.length]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onCoverPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setCover(f);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Event title is required";
    if (!form.summary.trim()) e.summary = "Summary is required";
    if (form.summary.length > SUMMARY_MAX)
      e.summary = `Summary must be at most ${SUMMARY_MAX} characters`;
    if (!form.date) e.date = "Date is required";
    if (!form.startTime) e.startTime = "Start time is required";
    if (!form.location.trim()) e.location = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (!validate()) return;

    setSaving(true);

    try {
      // join times into one string for your existing API (time)
      const time =
        form.endTime && form.startTime
          ? `${form.startTime} - ${form.endTime}`
          : form.startTime || "";

      // combine summary + description into a single HTML to keep your backend schema
      const descriptionHtml = `
        <section>
          <p><strong>Summary:</strong> ${escapeHtml(form.summary)}</p>
          ${form.description || ""}
        </section>
      `;

      const payload = {
        title: form.title.trim(),
        description: descriptionHtml,
        date: form.date,
        time,
        location: form.location.trim(),
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create event");

      setMsg("✅ Event created!");
      // reset minimal fields but keep image/description if you want
      setForm({
        title: "",
        summary: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
      });
      setCover(null);
      setErrors({});
    } catch (err) {
      setMsg(`❌ ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        {/* Left Sidebar */}
        <aside className="border-r bg-gray-50/60 px-4 py-6 lg:min-h-[calc(100vh-64px)]">
          <button
            className="mb-4 text-sm text-blue-600 hover:underline"
            onClick={() => history.back()}
          >
            &larr; Back to events
          </button>

          <div className="rounded-xl border bg-white shadow-sm">
            <div className="p-4 border-b">
              <div className="text-lg font-semibold">Event Title</div>
              <div className="mt-2 text-sm text-gray-600">
                {/* You could echo date/time here once filled */}
                {form.date ? new Date(form.date).toDateString() : "Pick a date"}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
                Draft
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <Step active title="Build event page">
                  Add all your event details and let attendees know what to expect
                </Step>
                <Step title="Add tickets" />
                <Step title="Publish" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Cover image area */}
          <div className="mb-6 overflow-hidden rounded-xl border bg-gray-100">
            <div className="relative aspect-[16/6] w-full">
              {/* cover preview */}
              {cover ? (
                <img
                  src={URL.createObjectURL(cover)}
                  alt="cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="rounded-xl bg-white/80 p-6 text-center shadow">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                      <Camera className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="font-medium">Upload photos and videos</div>
                    <label className="mt-2 inline-block cursor-pointer text-sm text-blue-600 hover:underline">
                      Choose file
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={onCoverPick}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* add button */}
              <label className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow hover:bg-gray-50">
                <Plus className="h-5 w-5 text-gray-700" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={onCoverPick}
                />
              </label>
            </div>
          </div>

          {/* Event Overview */}
          <form onSubmit={save} className="space-y-6">
            <Card title="Event Overview">
              {/* Event title */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">Event title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 ${
                    errors.title ? "border-red-400" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter an event title"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Summary */}
              <div>
                <label className="mb-2 block text-sm font-medium">Summary</label>
                <textarea
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  maxLength={SUMMARY_MAX}
                  className={`w-full rounded-lg border px-4 py-2 ${
                    errors.summary ? "border-red-400" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Grab people's attention with a short description (max 140 chars)"
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.summary ? (
                    <p className="text-xs text-red-600">{errors.summary}</p>
                  ) : (
                    <span className="text-xs text-gray-500">Be short and descriptive.</span>
                  )}
                  <span className="text-xs text-gray-500">{summaryCount}</span>
                </div>
              </div>
            </Card>

            {/* Date/time + Location */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="Date and time">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 ${
                        errors.date ? "border-red-400" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                    {errors.date && (
                      <p className="mt-1 text-xs text-red-600">{errors.date}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Start time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 ${
                        errors.startTime ? "border-red-400" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-xs text-red-600">{errors.startTime}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">End time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </Card>

              <Card title="Location">
                <label className="mb-2 block text-sm font-medium">Enter a location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={`mb-3 w-full rounded-lg border px-3 py-2 ${
                    errors.location ? "border-red-400" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Venue name or address"
                />
                {errors.location && (
                  <p className="mb-3 text-xs text-red-600">{errors.location}</p>
                )}
                {/* Map placeholder */}
                <div className="h-48 w-full rounded-lg border bg-gray-100" />
              </Card>
            </div>

            {/* Overview — Rich text editor */}
            <Card title="Overview">
              <p className="mb-3 text-sm text-gray-600">
                Use this section to provide more details about your event. You can include
                things to know, venue information, accessibility options, etc.
              </p>
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={(html) => setForm((p) => ({ ...p, description: html }))}
              />
            </Card>

            {/* Good to know */}
            <Card title="Good to know">
              <div className="flex flex-wrap gap-3">
                <button type="button" className="rounded-md border px-3 py-1.5 text-sm">
                  + Add Age information
                </button>
                <button type="button" className="rounded-md border px-3 py-1.5 text-sm">
                  + Add Door Time
                </button>
                <button type="button" className="rounded-md border px-3 py-1.5 text-sm">
                  + Add Parking information
                </button>
              </div>

              <div className="mt-6">
                <div className="text-sm font-medium">Frequently asked questions</div>
                <button type="button" className="mt-2 rounded-md border px-3 py-1.5 text-sm">
                  + Add question
                </button>
              </div>
            </Card>

            {/* Add more sections */}
            <Card title="Add more sections to your event page">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AddSectionCard label="Lineup" />
                <AddSectionCard label="Agenda" />
                <AddSectionCard label="Speakers" />
              </div>
            </Card>

            {/* Save & continue */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save and continue"}
              </button>
            </div>

            {msg && <p className="text-sm">{msg}</p>}
          </form>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------ UI Subcomponents ----------------------------- */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 text-xl font-semibold">{title}</div>
      {children}
    </section>
  );
}

function Step({
  title,
  children,
  active = false,
}: {
  title: string;
  children?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        active ? "border-blue-500 bg-blue-50/40" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-4 w-4 rounded-full ${
            active ? "bg-blue-600" : "bg-gray-300"
          }`}
        />
        <div className="font-medium">{title}</div>
      </div>
      {children && <p className="mt-2 text-xs text-gray-600">{children}</p>}
    </div>
  );
}

function AddSectionCard({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="font-medium">{label}</div>
      <button type="button" className="rounded-md border px-3 py-1.5 text-sm">
        Add
      </button>
    </div>
  );
}

/* --------------------------------- helpers --------------------------------- */

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
