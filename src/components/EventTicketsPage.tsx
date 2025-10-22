import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StepSidebar from "../components/StepSidebar";
import { useEventDraft } from "../contexts/EventDraftContext";
import { Plus, Trash2 } from "lucide-react";

interface Ticket {
  name: string;
  price: number;
  quantity: number;
}

export default function EventTicketsPage() {
  const { draftId } = useParams();
  const nav = useNavigate();
  const { draft } = useEventDraft();
  
  const [tickets, setTickets] = useState<Ticket[]>([
    { name: "", price: 0, quantity: 0 }
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const addTicket = () => {
    setTickets([...tickets, { name: "", price: 0, quantity: 0 }]);
  };

  const removeTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const updateTicket = (index: number, field: keyof Ticket, value: string | number) => {
    const updatedTickets = [...tickets];
    updatedTickets[index] = { ...updatedTickets[index], [field]: value };
    setTickets(updatedTickets);
  };

  const validateTickets = () => {
    if (tickets.length === 0) {
      setMessage("❌ Please add at least one ticket type");
      return false;
    }

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      if (!ticket.name.trim()) {
        setMessage(`❌ Ticket ${i + 1}: Name is required`);
        return false;
      }
      if (ticket.price <= 0) {
        setMessage(`❌ Ticket ${i + 1}: Price must be greater than 0`);
        return false;
      }
      if (ticket.quantity <= 0) {
        setMessage(`❌ Ticket ${i + 1}: Quantity must be greater than 0`);
        return false;
      }
    }

    return true;
  };

  const saveTickets = async () => {
    setMessage("");
    
    if (!validateTickets()) {
      return;
    }

    if (!draft.eventId) {
      setMessage("❌ No event ID found. Please go back and save the event first.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/events/${draft.eventId}/tickets`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tickets }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to save tickets");
      }

      setMessage("✅ Tickets saved successfully!");
      setTimeout(() => {
        nav(`/create/${draftId}/publish`);
      }, 1500);
    } catch (error) {
      setMessage(`❌ ${(error as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
      <StepSidebar />
      <main className="px-4 py-6 lg:px-8 lg:py-8">
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-4 text-xl font-semibold">Add Tickets</div>
          <p className="mb-4 text-gray-600 text-sm">
            Create ticket types and pricing for your event.
          </p>

          <div className="space-y-4">
            {tickets.map((ticket, index) => (
              <div key={index} className="grid gap-4 sm:grid-cols-4 items-end">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Ticket Name
                  </label>
                  <input
                    type="text"
                    value={ticket.name}
                    onChange={(e) => updateTicket(index, "name", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., General Admission"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={ticket.price}
                    onChange={(e) => updateTicket(index, "price", parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={ticket.quantity}
                    onChange={(e) => updateTicket(index, "quantity", parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="100"
                  />
                </div>

                <div className="flex gap-2">
                  {tickets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicket(index)}
                      className="flex items-center justify-center w-10 h-10 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addTicket}
            className="mt-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add another ticket type
          </button>

          {message && (
            <div className={`mt-4 text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => nav(`/create/${draftId}/build`)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={saveTickets}
              disabled={saving}
              className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save and continue"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
