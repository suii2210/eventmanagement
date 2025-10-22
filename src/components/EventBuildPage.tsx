import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import StepSidebar from "../components/StepSidebar";
import { useEventDraft } from "../contexts/EventDraftContext";
import { Camera, Plus, Ghost, Music, Globe, Drama, Heart, Gamepad2, Briefcase, Coffee } from "lucide-react";

const SUMMARY_MAX = 140;

const categories = [
  { name: 'Halloween', icon: Ghost, badge: 'New' },
  { name: 'Music', icon: Music },
  { name: 'Nightlife', icon: Globe },
  { name: 'Performing & Visual Arts', icon: Drama },
  { name: 'Dating', icon: Heart },
  { name: 'Hobbies', icon: Gamepad2 },
  { name: 'Business', icon: Briefcase },
  { name: 'Food & Drink', icon: Coffee },
];

export default function EventBuildPage() {
  const nav = useNavigate();
  const { draftId } = useParams();
  const { setTitle, setDate, setEventId } = useEventDraft();

  const [cover, setCover] = useState<File | null>(null);
  const [title, setLocalTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [date, setLocalDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const summaryCount = useMemo(() => `${summary.length} / ${SUMMARY_MAX}`, [summary]);

  const onCoverPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setCover(f);
  };

  // keep sidebar live
  const onTitleChange = (v: string) => {
    setLocalTitle(v);
    setTitle(v);
  };
  const onDateChange = (v: string) => {
    setLocalDate(v);
    setDate(v);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Event title is required";
    if (!summary.trim()) e.summary = "Summary is required";
    if (summary.length > SUMMARY_MAX) e.summary = `Max ${SUMMARY_MAX} characters`;
    if (!date) e.date = "Date is required";
    if (!startTime) e.startTime = "Start time is required";
    if (!location.trim()) e.location = "Location is required";
    if (!selectedCategory.trim()) e.category = "Please select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setMsg("");
    if (!validate()) return;

    setSaving(true);
    try {
      const time = endTime ? `${startTime} - ${endTime}` : startTime;
      const descriptionHtml = `
        <section>
          <p><strong>Summary:</strong> ${escapeHtml(summary)}</p>
          ${description || ""}
        </section>
      `;

      const payload = {
        title: title.trim(),
        description: descriptionHtml,
        summary: summary.trim(),
        category: selectedCategory || "General",
        date,
        time,
        startTime,
        endTime,
        location: location.trim(),
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create event");

      // Store the event ID for the next steps
      if (data.event && data.event._id) {
        setEventId(data.event._id);
      }

      setMsg("✅ Saved. Next: tickets");
      // go to tickets step
      nav(`/create/${draftId}/tickets`);
    } catch (err) {
      setMsg(`❌ ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
      <StepSidebar />

      <main className="px-4 py-6 lg:px-8 lg:py-8">
        {/* Cover image */}
        <div className="mb-6 overflow-hidden rounded-xl border bg-gray-100">
          <div className="relative aspect-[16/6] w-full">
            {cover ? (
              <img src={URL.createObjectURL(cover)} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="rounded-xl bg-white/80 p-6 text-center shadow">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                    <Camera className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="font-medium">Upload photos and videos</div>
                  <label className="mt-2 inline-block cursor-pointer text-sm text-blue-600 hover:underline">
                    Choose file
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={onCoverPick} />
                  </label>
                </div>
              </div>
            )}

            <label className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow hover:bg-gray-50">
              <Plus className="h-5 w-5 text-gray-700" />
              <input type="file" accept="image/*,video/*" className="hidden" onChange={onCoverPick} />
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={save} className="space-y-6">
          <Card title="Event Overview">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">Event title</label>
              <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className={`w-full rounded-lg border px-4 py-2 ${errors.title ? "border-red-400" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="Enter an event title"
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                maxLength={SUMMARY_MAX}
                className={`w-full rounded-lg border px-4 py-2 ${errors.summary ? "border-red-400" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="Short description (max 140 chars)"
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

          {/* Category Selection */}
          <Card title="Event Category">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select a category for your event
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.name;
                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => setSelectedCategory(category.name)}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border transition-all hover:scale-105 ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {category.badge && (
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                          {category.badge}
                        </span>
                      )}
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                        isSelected ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 transition-colors ${
                          isSelected ? 'text-orange-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className={`text-xs font-medium text-center ${
                        isSelected ? 'text-orange-700' : 'text-gray-700'
                      }`}>
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.category && <p className="mt-2 text-xs text-red-600">{errors.category}</p>}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Date and time">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => onDateChange(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${errors.date ? "border-red-400" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Start time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${errors.startTime ? "border-red-400" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  {errors.startTime && <p className="mt-1 text-xs text-red-600">{errors.startTime}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">End time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </Card>

            <Card title="Location">
              <label className="mb-2 block text-sm font-medium">Enter a location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`mb-3 w-full rounded-lg border px-3 py-2 ${errors.location ? "border-red-400" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="Venue name or address"
              />
              {errors.location && <p className="mb-3 text-xs text-red-600">{errors.location}</p>}
              <div className="h-48 w-full rounded-lg border bg-gray-100" />
            </Card>
          </div>

          <Card title="Overview">
            <ReactQuill theme="snow" value={description} onChange={setDescription} />
          </Card>

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
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 text-xl font-semibold">{title}</div>
      {children}
    </section>
  );
}

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
