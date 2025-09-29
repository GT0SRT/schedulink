import React, { useEffect, useMemo, useRef, useState } from "react";

// HelpSupportPage.jsx
// Full-featured Help & Support page built as a single-file React component.
// - Tailwind CSS required in the project
// - Primary theme color: #2C3E86
// - Accessibility minded (aria attributes, keyboard support)
// - Features:
//   * Hero header with action buttons (Documentation, User Manual)
//   * Search bar with category filter
//   * Quick action cards (Contact Support, Tutorials, FAQs, Downloads)
//   * Tabbed content area (FAQs, Tutorials, Contact Support, Resources)
//   * Expandable/collapsible FAQ accordion with search and category filtering
//   * Tutorial list with video placeholders, filtering and tags
//   * Downloads/resources section with file preview and simulated download
//   * Contact Support form with file upload, validation and localStorage persistence
//   * Persisted user messages and recently viewed FAQ / tutorial history
//   * Small utilities: debounce, slugify, formatDate

export default function HelpSupportPage() {
  const PRIMARY = "#2C3E86";

  // sample data (can be replaced with API responses)
  const sampleFAQs = [
    {
      id: "faq-1",
      q: "How do I add a new teacher to the system?",
      a: "To add a new teacher, go to Manage Teachers, click \"Add Teacher\", fill in the required fields (name, email, department) and click Save. Optionally upload a profile picture and set status.",
      category: "Teachers",
    },
    {
      id: "faq-2",
      q: "How can I generate attendance reports?",
      a: "Open the Reports section, choose Attendance Reports, set filters (date range, class, teacher) and click Generate. You can export the result as CSV or PDF.",
      category: "Reports",
    },
    {
      id: "faq-3",
      q: "How do I create a class schedule?",
      a: "Go to Manage Schedules, choose Add Schedule, select classes and assign teachers. Use the visual calendar to avoid conflicts and click Save.",
      category: "Schedules",
    },
    {
      id: "faq-4",
      q: "How to configure notification settings?",
      a: "Visit Settings > Notifications, toggle the channels you want (email, SMS, in-app) and set thresholds for alerts.",
      category: "Settings",
    },
    {
      id: "faq-5",
      q: "What happens when I delete a teacher?",
      a: "Deleting a teacher will remove their assignments. You will be prompted to reassign classes. This action is irreversible — make sure to export any needed data first.",
      category: "Teachers",
    },
  ];

  const sampleTutorials = [
    {
      id: "tut-1",
      title: "Creating a Class Schedule (Quick)",
      duration: "6:12",
      tags: ["schedules", "getting-started"],
      description: "Step-by-step guide to create and publish class schedules.",
      videoUrl: "",
    },
    {
      id: "tut-2",
      title: "Managing Teachers & Profiles",
      duration: "8:40",
      tags: ["teachers"],
      description: "Add/edit teacher profiles, bulk-import, and status management.",
      videoUrl: "",
    },
    {
      id: "tut-3",
      title: "Attendance Tracking and Reports",
      duration: "10:05",
      tags: ["attendance", "reports"],
      description: "How to track attendance using scanner or manual marking and generate reports.",
      videoUrl: "",
    },
  ];

  const sampleResources = [
    { id: "res-1", name: "Admin User Manual (PDF)", size: "1.2MB", href: "#" },
    { id: "res-2", name: "Class Scheduling Template (XLSX)", size: "80KB", href: "#" },
    { id: "res-3", name: "API Reference (Markdown)", size: "320KB", href: "#" },
  ];

  // persisted state
  const [faqs, setFaqs] = useState(() => {
    try {
      const raw = localStorage.getItem("help-faqs");
      return raw ? JSON.parse(raw) : sampleFAQs;
    } catch {
      return sampleFAQs;
    }
  });

  const [tutorials, setTutorials] = useState(sampleTutorials);
  const [resources, setResources] = useState(sampleResources);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeTab, setActiveTab] = useState("faqs"); // faqs | tutorials | contact | resources

  // Contact form
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "", attachment: null });
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("help-messages");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [openFAQ, setOpenFAQ] = useState(null); // id of open FAQ
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const raw = localStorage.getItem("help-recent");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("help-faqs", JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem("help-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("help-recent", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // derive categories
  const categories = useMemo(() => {
    const s = new Set(faqs.map((f) => f.category));
    return ["All Categories", ...Array.from(s)];
  }, [faqs]);

  // simple debounce for search to reduce re-renders
  function useDebouncedValue(value, delay = 250) {
    const [v, setV] = useState(value);
    useEffect(() => {
      const t = setTimeout(() => setV(value), delay);
      return () => clearTimeout(t);
    }, [value, delay]);
    return v;
  }

  const debouncedQuery = useDebouncedValue(query, 250);

  const filteredFAQs = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return faqs
      .filter((f) => (selectedCategory === "All Categories" ? true : f.category === selectedCategory))
      .filter((f) => {
        if (!q) return true;
        return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
      });
  }, [faqs, debouncedQuery, selectedCategory]);

  const filteredTutorials = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return tutorials.filter((t) => {
      if (!q) return true;
      return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.join(" ").includes(q);
    });
  }, [tutorials, debouncedQuery]);

  // utilities
  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleString();
  }

  // FAQ interactions
  function toggleFAQ(id) {
    setOpenFAQ((cur) => (cur === id ? null : id));
    const f = faqs.find((x) => x.id === id);
    if (f) {
      setRecentlyViewed((rv) => {
        const next = [
          { id: f.id, title: f.q, type: "faq", at: Date.now() },
          ...rv.filter((r) => r.id !== f.id),
        ].slice(0, 10);
        return next;
      });
    }
  }

  // tutorial interactions
  function openTutorial(t) {
    setActiveTab("tutorials");
    setRecentlyViewed((rv) => {
      const next = [
        { id: t.id, title: t.title, type: "tutorial", at: Date.now() },
        ...rv.filter((r) => r.id !== t.id),
      ].slice(0, 10);
      return next;
    });
    // for demo, we don't embed real videos; you could open a modal here
  }

  // Contact form submit (simulated)
  function handleContactSubmit(e) {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      alert("Please fill all fields before submitting.");
      return;
    }
    const msg = {
      id: `msg-${Date.now()}`,
      name: contactForm.name,
      email: contactForm.email,
      subject: contactForm.subject,
      message: contactForm.message,
      attachment: contactForm.attachment ? { name: contactForm.attachment.name, size: contactForm.attachment.size } : null,
      status: "queued",
      createdAt: Date.now(),
    };
    setMessages((m) => [msg, ...m]);
    setContactForm({ name: "", email: "", subject: "", message: "", attachment: null });
    alert("Message submitted — our support team will respond via email.");
    setActiveTab("contact");
  }

  function handleFileChange(file) {
    if (!file) return;
    // simple validation: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Attachment too large (max 5MB)");
      return;
    }
    setContactForm((f) => ({ ...f, attachment: file }));
  }

  // Admin-like helpers: add new FAQ (demo only)
  function addFAQ(q, a, category) {
    const newFaq = { id: `faq-${Date.now()}`, q, a, category };
    setFaqs((s) => [newFaq, ...s]);
  }

  // keyboard: close with ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpenFAQ(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // refs for accessibility and focus
  const searchRef = useRef(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#2C3E86]">Help & Support</h1>
            <p className="mt-1 text-gray-500">Find answers, tutorials, and get support for using the admin system.</p>
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="inline-flex items-center gap-2 border rounded-xl px-4 py-2 bg-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 3v3" />
              </svg>
              Documentation
            </a>

            <a href="#" className="inline-flex items-center gap-2 border rounded-xl px-4 py-2 bg-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5a2 2 0 012-2h3v2H5v14h14v-3h2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                <path d="M7 7h10v2H7z" />
              </svg>
              User Manual
            </a>
          </div>
        </div>

        {/* Search + category */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for help topics, tutorials, or FAQs..."
                className="w-full border rounded-xl p-4 pl-12"
                aria-label="Search help"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
              </svg>
            </div>

            <div>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border rounded-xl px-4 py-3">
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="ml-auto">
              <button onClick={() => { setQuery(""); setSelectedCategory("All Categories"); }} className="border rounded-xl px-4 py-2">Clear</button>
            </div>
          </div>
        </div>

        {/* Quick cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-start gap-2 cursor-pointer" onClick={() => setActiveTab("contact")}>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center text-[#2C3E86]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8l4-2 4 2 4-2 4 2z" />
              </svg>
            </div>
            <div className="font-semibold">Contact Support</div>
            <div className="text-sm text-gray-500">Get help from our team</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-start gap-2 cursor-pointer" onClick={() => setActiveTab("tutorials")}>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 7L9 13V3z" />
                <path d="M3 5v14h18V5H3z" />
              </svg>
            </div>
            <div className="font-semibold">Tutorials</div>
            <div className="text-sm text-gray-500">Step-by-step guides</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-start gap-2 cursor-pointer" onClick={() => setActiveTab("faqs")}>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 10h2v5h-2v-5zM11 7h2v2h-2V7z" />
              </svg>
            </div>
            <div className="font-semibold">FAQs</div>
            <div className="text-sm text-gray-500">Common questions</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-start gap-2 cursor-pointer" onClick={() => setActiveTab("resources")}>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v12m-4 4h8" />
              </svg>
            </div>
            <div className="font-semibold">Downloads</div>
            <div className="text-sm text-gray-500">Manuals & resources</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex gap-4 border-b mb-6">
            <button onClick={() => setActiveTab("faqs")} className={`px-6 py-3 rounded-t-xl ${activeTab === "faqs" ? "bg-white border" : "bg-gray-100"}`}>FAQs</button>
            <button onClick={() => setActiveTab("tutorials")} className={`px-6 py-3 rounded-t-xl ${activeTab === "tutorials" ? "bg-white border" : "bg-gray-100"}`}>Tutorials</button>
            <button onClick={() => setActiveTab("contact")} className={`px-6 py-3 rounded-t-xl ${activeTab === "contact" ? "bg-white border" : "bg-gray-100"}`}>Contact Support</button>
            <button onClick={() => setActiveTab("resources")} className={`px-6 py-3 rounded-t-xl ${activeTab === "resources" ? "bg-white border" : "bg-gray-100"}`}>Resources</button>
          </div>

          {/* Tab panels */}
          {activeTab === "faqs" && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Frequently Asked Questions</h3>
              <p className="text-gray-500 mb-4">Find quick answers to common questions about using the admin system.</p>

              <div className="space-y-3">
                {filteredFAQs.map((f) => (
                  <div key={f.id} className="border rounded-lg">
                    <button
                      aria-expanded={openFAQ === f.id}
                      aria-controls={`faq-panel-${f.id}`}
                      onClick={() => toggleFAQ(f.id)}
                      className="w-full text-left px-4 py-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{f.q}</div>
                        <div className="text-xs text-gray-400">{f.category}</div>
                      </div>
                      <div className="text-gray-400">{openFAQ === f.id ? "▴" : "▾"}</div>
                    </button>

                    <div id={`faq-panel-${f.id}`} role="region" className={`px-4 pb-4 ${openFAQ === f.id ? "block" : "hidden"}`}>
                      <div className="text-gray-700">{f.a}</div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => navigator.clipboard?.writeText(`${f.q}\n\n${f.a}`)} className="px-3 py-1 border rounded">Copy</button>
                        <button onClick={() => { addFAQ(`Follow-up: ${f.q}`, "Thanks for your question! We're looking into this.", f.category); alert('Follow-up FAQ added (demo).'); }} className="px-3 py-1 border rounded">Add Follow-up</button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredFAQs.length === 0 && <div className="text-gray-400">No FAQs match your search.</div>}
              </div>

              <div className="mt-6">
                <h4 className="font-medium">Recently viewed</h4>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {recentlyViewed.map((r) => (
                    <div key={r.id} className="px-3 py-2 bg-gray-100 rounded">{r.title} <span className="text-xs text-gray-400">{formatDate(r.at)}</span></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "tutorials" && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Tutorials</h3>
              <p className="text-gray-500 mb-4">Short step-by-step walkthroughs and video guides.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTutorials.map((t) => (
                  <div key={t.id} className="border rounded-lg overflow-hidden">
                    <div className="flex gap-4 p-4">
                      <div className="w-36 h-20 bg-gray-200 flex items-center justify-center">Video</div>
                      <div className="flex-1">
                        <div className="font-medium">{t.title}</div>
                        <div className="text-sm text-gray-500">{t.description}</div>
                        <div className="mt-3 flex items-center gap-2">
                          {t.tags.map((tag) => <span key={tag} className="text-xs px-2 py-1 rounded bg-gray-100">{tag}</span>)}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border-t flex items-center justify-between">
                      <div className="text-sm text-gray-500">Duration: {t.duration}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openTutorial(t)} className="px-3 py-1 border rounded">Open</button>
                        <button onClick={() => navigator.clipboard?.writeText(t.title)} className="px-3 py-1 border rounded">Copy Title</button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredTutorials.length === 0 && <div className="text-gray-400">No tutorials match your search.</div>}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Contact Support</h3>
              <p className="text-gray-500 mb-4">Submit a request and our support team will respond via email.</p>

              <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Full name</span>
                  <input value={contactForm.name} onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))} className="border p-2 rounded" />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Email</span>
                  <input value={contactForm.email} onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))} className="border p-2 rounded" />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm text-gray-600">Subject</span>
                  <input value={contactForm.subject} onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))} className="border p-2 rounded" />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm text-gray-600">Message</span>
                  <textarea value={contactForm.message} onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))} className="border p-2 rounded h-32" />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm text-gray-600">Attachment (optional)</span>
                  <input type="file" onChange={(e) => handleFileChange(e.target.files && e.target.files[0])} className="mt-2" />
                  {contactForm.attachment && <div className="text-sm text-gray-500 mt-2">Attached: {contactForm.attachment.name}</div>}
                </label>

                <div className="md:col-span-2 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setContactForm({ name: "", email: "", subject: "", message: "", attachment: null })} className="px-4 py-2 rounded-lg border">Reset</button>
                  <button type="submit" className="px-4 py-2 rounded-lg" style={{ background: PRIMARY, color: "white" }}>Send Request</button>
                </div>

                <div className="md:col-span-2 mt-4">
                  <h4 className="font-medium">Recent messages</h4>
                  <div className="mt-2 space-y-2">
                    {messages.map((m) => (
                      <div key={m.id} className="border rounded p-3 flex items-start justify-between">
                        <div>
                          <div className="font-medium">{m.subject}</div>
                          <div className="text-sm text-gray-500">From {m.name} — {formatDate(m.createdAt)}</div>
                          <div className="text-sm mt-2">{m.message}</div>
                        </div>
                        <div className="text-sm text-gray-400">{m.status}</div>
                      </div>
                    ))}

                    {messages.length === 0 && <div className="text-gray-400">No messages yet.</div>}
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === "resources" && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Resources & Downloads</h3>
              <p className="text-gray-500 mb-4">Manuals, templates and API references available to download.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resources.map((r) => (
                  <div key={r.id} className="border rounded-lg p-4 flex flex-col gap-2">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-sm text-gray-500">{r.size}</div>
                    <div className="mt-auto flex items-center gap-2">
                      <a href={r.href} onClick={(e) => { e.preventDefault(); alert(`Starting download: ${r.name} (simulated)`); }} className="px-3 py-1 border rounded">Download</a>
                      <button onClick={() => navigator.clipboard?.writeText(r.name)} className="px-3 py-1 border rounded">Copy name</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-medium">Tips</h4>
                <ul className="list-disc ml-6 text-sm text-gray-600 mt-2">
                  <li>Check the User Manual for detailed workflows.</li>
                  <li>Use Tutorials for quick walkthroughs before contacting support.</li>
                  <li>Keep attachments under 5MB when contacting support.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating quick help bubble */}
      <div className="fixed bottom-6 right-6">
        <button title="Quick Contact" onClick={() => setActiveTab("contact")} className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center" style={{ background: PRIMARY, color: "white" }}>
          ?
        </button>
      </div>
    </div>
  );
}