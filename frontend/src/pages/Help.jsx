import React, { useEffect, useMemo, useRef, useState } from "react";

/*
  Help.jsx - Help & Support page
  - Single-file React component (export default HelpSupportPage)
  - TailwindCSS is required in the project for styling to match the rest of your app
  - Features included in this expanded version:
    * Full hero with action buttons
    * Search bar with category filter and debounced search
    * Quick action cards (Contact Support, Tutorials, FAQs, Downloads)
    * Tabbed content (FAQs, Tutorials, Contact Support, Resources) with keyboard support
    * Rich FAQ accordion with categories, copy, add follow-up (demo), and bookmark
    * Tutorials list with tags, difficulty badges, video modal (simulated), and pagination
    * Contact Support ticket form with category, priority, attachment (size limit), persisted tickets
    * Resources & downloads grid with simulated downloads and external links
    * Recently viewed history and quick actions
    * LocalStorage persistence so data survives reloads during development
    * Accessibility considerations (aria attributes, focusable buttons)

  Usage:
    import HelpSupportPage from './pages/Help';
    <Route path="help" element={<HelpSupportPage />} />
*/

const PRIMARY = "#2C3E86";

function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function HelpSupportPage() {
  // --- SAMPLE DATA ---
  const sampleFAQs = [
    { id: 'faq-1', q: 'How do I add a new teacher to the system?', a: 'To add a new teacher, open Manage Teachers → Add Teacher → fill name, email, department and click Save. You can also bulk-import via CSV in the top-right actions.', category: 'Teachers' },
    { id: 'faq-2', q: 'How can I generate attendance reports?', a: 'Go to Reports → Attendance Reports. Choose filters (date range, class, teacher) then click Generate. Export options available (CSV/PDF).', category: 'Reports' },
    { id: 'faq-3', q: 'How do I create a class schedule?', a: 'Go to Manage Schedules → Create Schedule. Select class, assign teacher and timeslot. The scheduler flags conflicts automatically.', category: 'Schedules' },
    { id: 'faq-4', q: 'How to configure notification settings?', a: 'Open Settings → Notifications and toggle channels (Email, SMS, In-App). Configure thresholds for alerts per event type.', category: 'Settings' },
  ];

  const sampleTutorials = [
    { id: 't-1', title: 'Getting Started with Admin Dashboard', description: 'Learn the basics of navigating the admin dashboard and understanding key metrics.', duration: '10 min', difficulty: 'Beginner', tags: ['dashboard', 'onboarding'] },
    { id: 't-2', title: 'Setting Up Your Institution Profile', description: 'Configure institution info, academic calendar, and basic settings.', duration: '15 min', difficulty: 'Beginner', tags: ['setup'] },
    { id: 't-3', title: 'Managing Teachers & Profiles', description: 'Add/edit teacher profiles, bulk import, and status management.', duration: '8 min', difficulty: 'Intermediate', tags: ['teachers'] },
    { id: 't-4', title: 'Attendance Tracking and Reports', description: 'Track attendance via scanner or manually and generate reports.', duration: '12 min', difficulty: 'Intermediate', tags: ['attendance', 'reports'] },
    { id: 't-5', title: 'Advanced Schedule Conflict Resolution', description: 'Tips for resolving scheduling conflicts and using the auto-resolver.', duration: '9 min', difficulty: 'Advanced', tags: ['schedules', 'advanced'] },
  ];

  const sampleResources = [
    { id: 'r-1', name: 'Admin User Manual (PDF)', type: 'pdf', size: '1.1 MB', href: '#' },
    { id: 'r-2', name: 'Class Scheduling Template (XLSX)', type: 'xlsx', size: '68 KB', href: '#' },
    { id: 'r-3', name: 'API Reference (HTML)', type: 'link', size: '—', href: '#' },
  ];

  // --- STATE (with localStorage persistence) ---
  const [faqs, setFaqs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('help-faqs')) || sampleFAQs; } catch (e) { return sampleFAQs; }
  });
  const [tutorials, setTutorials] = useState(() => {
    try { return JSON.parse(localStorage.getItem('help-tutorials')) || sampleTutorials; } catch { return sampleTutorials; }
  });
  const [resources, setResources] = useState(() => {
    try { return JSON.parse(localStorage.getItem('help-resources')) || sampleResources; } catch { return sampleResources; }
  });

  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('help-messages')) || []; } catch { return []; }
  });

  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('help-recent')) || []; } catch { return []; }
  });

  // ui
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [activeTab, setActiveTab] = useState('faqs');

  // contact form
  const [ticket, setTicket] = useState({ subject: '', category: '', priority: 'Medium', description: '', attachment: null });

  // accordion
  const [openFAQ, setOpenFAQ] = useState(null);

  // tutorial modal
  const [videoOpen, setVideoOpen] = useState(null);

  // tutorial pagination
  const [page, setPage] = useState(1);
  const perPage = 4;

  // debounce
  const debouncedQuery = useDebounced(query, 250);

  // derived categories for the dropdown (faqs + resources)
  const faqCategories = useMemo(() => {
    const s = new Set(faqs.map(f => f.category));
    return ['All Categories', ...Array.from(s)];
  }, [faqs]);

  // persist
  useEffect(() => localStorage.setItem('help-faqs', JSON.stringify(faqs)), [faqs]);
  useEffect(() => localStorage.setItem('help-tutorials', JSON.stringify(tutorials)), [tutorials]);
  useEffect(() => localStorage.setItem('help-resources', JSON.stringify(resources)), [resources]);
  useEffect(() => localStorage.setItem('help-messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('help-recent', JSON.stringify(recent)), [recent]);

  // --- FILTERING ---
  const filteredFAQs = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return faqs.filter(f => (category === 'All Categories' ? true : f.category === category))
      .filter(f => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [faqs, debouncedQuery, category]);

  const filteredTutorials = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return tutorials.filter(t => !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.join(' ').includes(q));
  }, [tutorials, debouncedQuery]);

  // pagination slice
  const tutorialPageCount = Math.max(1, Math.ceil(filteredTutorials.length / perPage));
  const tutorialPageItems = filteredTutorials.slice((page - 1) * perPage, page * perPage);

  function markRecent(item) {
    setRecent(r => {
      const next = [{ ...item, at: Date.now() }, ...r.filter(x => x.id !== item.id)].slice(0, 10);
      return next;
    });
  }

  // --- ACTIONS ---
  function toggleFAQ(id) {
    setOpenFAQ(cur => (cur === id ? null : id));
    const f = faqs.find(x => x.id === id);
    if (f) markRecent({ id: f.id, title: f.q, type: 'faq' });
  }

  function addFollowUpFAQ(originalId) {
    const orig = faqs.find(x => x.id === originalId);
    if (!orig) return;
    const newFaq = { id: `faq-${Date.now()}`, q: `Follow-up: ${orig.q}`, a: 'This is a follow-up placeholder answer (demo).', category: orig.category };
    setFaqs(s => [newFaq, ...s]);
    alert('Follow-up FAQ added (demo).');
  }

  function copyFAQ(f) {
    navigator.clipboard?.writeText(`${f.q}

${f.a}`);
    alert('FAQ copied to clipboard.');
  }

  function openTutorial(t) {
    setVideoOpen(t);
    markRecent({ id: t.id, title: t.title, type: 'tutorial' });
  }

  function submitTicket(e) {
    e.preventDefault();
    if (!ticket.subject || !ticket.description || !ticket.category) {
      alert('Please fill Subject, Category and Description.');
      return;
    }
    const t = { id: `msg-${Date.now()}`, ...ticket, status: 'Open', createdAt: Date.now() };
    setMessages(m => [t, ...m]);
    markRecent({ id: t.id, title: t.subject, type: 'ticket' });
    setTicket({ subject: '', category: '', priority: 'Medium', description: '', attachment: null });
    setActiveTab('contact');
    alert('Ticket submitted. Support will contact you shortly (simulated).');
  }

  function handleAttachmentChange(file) {
    if (!file) return setTicket(t => ({ ...t, attachment: null }));
    // limit 10MB
    if (file.size > 10 * 1024 * 1024) return alert('Attachment too large (max 10MB).');
    setTicket(t => ({ ...t, attachment: { name: file.name, size: file.size } }));
  }

  function simulateDownload(res) {
    alert(`Starting download: ${res.name} (simulated)`);
    markRecent({ id: res.id, title: res.name, type: 'resource' });
  }

  // admin/demo: allow adding FAQ quickly
  function addFAQDemo() {
    const q = prompt('FAQ question');
    if (!q) return;
    const a = prompt('FAQ answer');
    const cat = prompt('Category (Teachers/Reports/Schedules/Settings)') || 'General';
    const newFaq = { id: `faq-${Date.now()}`, q, a, category: cat };
    setFaqs(s => [newFaq, ...s]);
  }

  // keyboard ESC to close video or accordion
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpenFAQ(null);
        setVideoOpen(null);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // reset page when query changes
  useEffect(() => setPage(1), [debouncedQuery, category]);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#2C3E86]">Help & Support</h1>
            <p className="mt-1 text-gray-500">Find answers, tutorials, and get support for using the admin system.</p>
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="inline-flex items-center gap-2 border rounded-xl px-4 py-2 bg-white shadow-sm">Documentation</a>
            <a href="#" className="inline-flex items-center gap-2 border rounded-xl px-4 py-2 bg-white shadow-sm">User Manual</a>
          </div>
        </div>

        {/* search + filters */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for help topics, tutorials, or FAQs..." className="w-full border rounded-xl p-4 pl-12" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" /></svg>
            </div>

            <div>
              <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded-xl px-4 py-3">
                {faqCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="ml-auto">
              <button onClick={() => { setQuery(''); setCategory('All Categories'); }} className="border rounded-xl px-4 py-2">Clear</button>
            </div>
          </div>
        </div>

        {/* quick cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-6 bg-white rounded-xl shadow-sm cursor-pointer" onClick={() => setActiveTab('contact')}>
            <div className="text-[#2C3E86] text-2xl">💬</div>
            <div className="font-semibold mt-2">Contact Support</div>
            <div className="text-sm text-gray-500">Get help from our team</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm cursor-pointer" onClick={() => setActiveTab('tutorials')}>
            <div className="text-green-600 text-2xl">📘</div>
            <div className="font-semibold mt-2">Tutorials</div>
            <div className="text-sm text-gray-500">Step-by-step guides</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm cursor-pointer" onClick={() => setActiveTab('faqs')}>
            <div className="text-purple-600 text-2xl">❓</div>
            <div className="font-semibold mt-2">FAQs</div>
            <div className="text-sm text-gray-500">Common questions</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm cursor-pointer" onClick={() => setActiveTab('resources')}>
            <div className="text-orange-500 text-2xl">⬇️</div>
            <div className="font-semibold mt-2">Downloads</div>
            <div className="text-sm text-gray-500">Manuals & resources</div>
          </div>
        </div>

        {/* tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex gap-4 border-b mb-6 overflow-auto">
            <button onClick={() => setActiveTab('faqs')} className={`px-6 py-3 rounded-t-xl ${activeTab === 'faqs' ? 'bg-white border' : 'bg-gray-100'}`}>FAQs</button>
            <button onClick={() => setActiveTab('tutorials')} className={`px-6 py-3 rounded-t-xl ${activeTab === 'tutorials' ? 'bg-white border' : 'bg-gray-100'}`}>Tutorials</button>
            <button onClick={() => setActiveTab('contact')} className={`px-6 py-3 rounded-t-xl ${activeTab === 'contact' ? 'bg-white border' : 'bg-gray-100'}`}>Contact Support</button>
            <button onClick={() => setActiveTab('resources')} className={`px-6 py-3 rounded-t-xl ${activeTab === 'resources' ? 'bg-white border' : 'bg-gray-100'}`}>Resources</button>
          </div>

          {/* PANEL: FAQs */}
          {activeTab === 'faqs' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
                  <p className="text-gray-500">Find quick answers to common questions about using the admin system.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => addFAQDemo()} className="px-3 py-2 border rounded">Add FAQ (demo)</button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredFAQs.length === 0 && <div className="text-gray-400">No FAQs match your search.</div>}

                {filteredFAQs.map(f => (
                  <div key={f.id} className="border rounded-lg">
                    <button aria-expanded={openFAQ === f.id} onClick={() => toggleFAQ(f.id)} className="w-full text-left px-4 py-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{f.q}</div>
                        <div className="text-xs text-gray-400">{f.category}</div>
                      </div>
                      <div className="text-gray-400">{openFAQ === f.id ? '▴' : '▾'}</div>
                    </button>

                    <div className={`px-4 pb-4 ${openFAQ === f.id ? 'block' : 'hidden'}`}>
                      <div className="text-gray-700">{f.a}</div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => copyFAQ(f)} className="px-3 py-1 border rounded">Copy</button>
                        <button onClick={() => addFollowUpFAQ(f.id)} className="px-3 py-1 border rounded">Add Follow-up</button>
                        <button onClick={() => { setFaqs(prev => prev.filter(x => x.id !== f.id)); alert('FAQ removed (demo)'); }} className="px-3 py-1 border rounded text-red-500">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-medium">Recently viewed</h4>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {recent.map(r => <div key={r.id} className="px-3 py-2 bg-gray-100 rounded text-sm">{r.title} <span className="text-xs text-gray-400 ml-2">{formatDate(r.at)}</span></div>)}
                </div>
              </div>
            </div>
          )}

          {/* PANEL: Tutorials */}
          {activeTab === 'tutorials' && (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg">Tutorials & Guides</h3>
                <p className="text-gray-500">Short walkthroughs and videos to help onboard you and your staff quickly.</p>
              </div>

              <div className="space-y-4">
                {tutorialPageItems.map(t => (
                  <div key={t.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-28 h-16 bg-gray-200 flex items-center justify-center rounded">Video</div>
                      <div>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-sm text-gray-500">{t.description}</div>
                        <div className="mt-2 flex gap-2">{t.tags.map(tag => <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded">{tag}</span>)}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-gray-500">{t.duration} • <span className="px-2 py-1 text-xs rounded bg-gray-100">{t.difficulty}</span></div>
                      <div className="flex gap-2">
                        <button onClick={() => openTutorial(t)} className="px-3 py-1 border rounded">Watch</button>
                        <button onClick={() => { navigator.clipboard?.writeText(t.title); alert('Title copied'); }} className="px-3 py-1 border rounded">Copy</button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">Page {page} of {tutorialPageCount}</div>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded">Prev</button>
                    <button onClick={() => setPage(p => Math.min(tutorialPageCount, p + 1))} disabled={page === tutorialPageCount} className="px-3 py-1 border rounded">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PANEL: Contact Support */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg">Submit Support Ticket</h3>
                <p className="text-gray-500 mb-4">Can't find what you're looking for? Contact our support team and we'll get back to you.</p>

                <form onSubmit={submitTicket} className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Subject</label>
                    <input value={ticket.subject} onChange={e => setTicket(t => ({ ...t, subject: e.target.value }))} className="w-full border rounded p-2" placeholder="Brief description of your issue" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">Category</label>
                      <select value={ticket.category} onChange={e => setTicket(t => ({ ...t, category: e.target.value }))} className="w-full border rounded p-2">
                        <option value="">Select category</option>
                        <option value="Teachers">Teachers</option>
                        <option value="Schedules">Schedules</option>
                        <option value="Attendance">Attendance</option>
                        <option value="Reports">Reports</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Priority</label>
                      <select value={ticket.priority} onChange={e => setTicket(t => ({ ...t, priority: e.target.value }))} className="w-full border rounded p-2">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Description</label>
                    <textarea value={ticket.description} onChange={e => setTicket(t => ({ ...t, description: e.target.value }))} className="w-full border rounded p-2 h-36" placeholder="Please provide detailed information about your issue..."></textarea>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Attachment (optional)</label>
                    <input type="file" onChange={e => handleAttachmentChange(e.target.files && e.target.files[0])} className="mt-2" />
                    {ticket.attachment && <div className="text-sm text-gray-500 mt-2">Attached: {ticket.attachment.name}</div>}
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button type="button" onClick={() => setTicket({ subject: '', category: '', priority: 'Medium', description: '', attachment: null })} className="px-4 py-2 rounded border">Reset</button>
                    <button type="submit" className="px-4 py-2 rounded" style={{ background: PRIMARY, color: '#fff' }}>Submit Ticket</button>
                  </div>
                </form>

                <div className="mt-6">
                  <h4 className="font-medium">Recent tickets</h4>
                  <div className="mt-2 space-y-2">
                    {messages.length === 0 && <div className="text-gray-400">No tickets yet.</div>}
                    {messages.map(m => (
                      <div key={m.id} className="border rounded p-3 flex items-start justify-between">
                        <div>
                          <div className="font-medium">{m.subject}</div>
                          <div className="text-sm text-gray-500">{m.category} • {m.priority} • {formatDate(m.createdAt)}</div>
                          <div className="mt-2 text-sm">{m.description}</div>
                        </div>
                        <div className="text-sm text-gray-400">{m.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Other Ways to Get Help</h3>
                <p className="text-gray-500 mb-4">Multiple channels to reach our support team.</p>

                <div className="space-y-3">
                  <div className="border rounded p-4">
                    <div className="font-medium">Email Support</div>
                    <div className="text-sm text-gray-500">support@smartuniversity.edu — Response within 24 hours</div>
                  </div>

                  <div className="border rounded p-4">
                    <div className="font-medium">Phone Support</div>
                    <div className="text-sm text-gray-500">+1 (555) 123-4567 • Mon-Fri, 9 AM - 6 PM EST</div>
                  </div>

                  <div className="border rounded p-4">
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm text-gray-500">Available on website — Mon-Fri, 9 AM - 6 PM EST</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium">Support Tips</h4>
                  <ul className="list-disc ml-6 text-sm text-gray-600 mt-2">
                    <li>Check tutorials before opening a ticket — many answers are quick wins.</li>
                    <li>Provide screenshots and exact steps in your ticket for faster resolution.</li>
                    <li>Keep attachments under 10MB for best results.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* PANEL: Resources */}
          {activeTab === 'resources' && (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg">Resources & Downloads</h3>
                <p className="text-gray-500">Useful resources, documentation, and downloadable materials.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map(r => (
                  <div key={r.id} className="border rounded-lg p-4 flex flex-col gap-2">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-sm text-gray-500">{r.size} • {r.type}</div>
                    <div className="mt-auto flex gap-2">
                      <button onClick={() => simulateDownload(r)} className="px-3 py-1 border rounded">Download</button>
                      <a href={r.href} onClick={e => { e.preventDefault(); window.open(r.href, '_blank'); }} className="px-3 py-1 border rounded">Open</a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-medium">Tips</h4>
                <ul className="list-disc ml-6 text-sm text-gray-600 mt-2">
                  <li>Download the User Manual for comprehensive instructions.</li>
                  <li>Use the scheduling template when creating many classes offline.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIDEO MODAL (simulated) */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setVideoOpen(null)} />
          <div className="relative bg-white max-w-3xl w-full rounded-2xl p-6 z-10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{videoOpen.title}</h3>
              <button onClick={() => setVideoOpen(null)} className="text-gray-500">Close</button>
            </div>
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">Video player (simulated)</div>
            <p className="text-sm text-gray-600 mt-3">{videoOpen.description}</p>
          </div>
        </div>
      )}

      {/* floating quick help */}
      <div className="fixed bottom-6 right-6">
        <button onClick={() => setActiveTab('contact')} className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center" style={{ background: PRIMARY, color: '#fff' }}>?</button>
      </div>
    </div>
  );
}
