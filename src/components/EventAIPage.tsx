import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type Form = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
};

export default function EventAIPage() {
  const [form, setForm] = useState<Form>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const createWithAI = async () => {
    setCreating(true);
    setMsg("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/events/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "AI creation failed");
      setMsg("✅ AI event created!");
    } catch (err) {
      setMsg(`❌ ${(err as Error).message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create an event with AI</h1>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Event Title</label>
          <input
            name="title"
            value={form.title}
            onChange={change}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={change}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Start time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={change}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={change}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Description</label>
          <ReactQuill
            theme="snow"
            value={form.description}
            onChange={(html) => setForm((p) => ({ ...p, description: html }))}
          />
        </div>

        <button
          onClick={createWithAI}
          disabled={creating}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create Event"}
        </button>
      </div>

      {msg && <p className="mt-4 text-sm">{msg}</p>}
    </div>
  );
}
