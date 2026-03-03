import { useState, useEffect, useCallback, useRef } from 'react';
import {
  generateEmail,
  generateIncomingEmail,
  formatTime,
  formatTimeLeft,
  type Email,
} from './emailData';

// ─── Icons as inline SVG components ───
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
);
const PaperclipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);

const SESSION_DURATION = 600; // 10 minutes

export default function App() {
  const [email, setEmail] = useState<string>('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [showInfo, setShowInfo] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [newEmailFlash, setNewEmailFlash] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const emailIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate initial email
  const initSession = useCallback(() => {
    const newEmail = generateEmail();
    setEmail(newEmail);
    setEmails([]);
    setSelectedEmail(null);
    setTimeLeft(SESSION_DURATION);
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  // Countdown timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          initSession();
          return SESSION_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initSession]);

  // Simulate incoming emails
  useEffect(() => {
    // Send first email quickly
    const firstTimer = setTimeout(() => {
      const newMail = generateIncomingEmail();
      setEmails(prev => [newMail, ...prev]);
      setNewEmailFlash(true);
      setTimeout(() => setNewEmailFlash(false), 1000);
    }, 2000);

    emailIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.35) {
        const newMail = generateIncomingEmail();
        setEmails(prev => [newMail, ...prev].slice(0, 30));
        setNewEmailFlash(true);
        setTimeout(() => setNewEmailFlash(false), 1000);
      }
    }, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(firstTimer);
      if (emailIntervalRef.current) clearInterval(emailIntervalRef.current);
    };
  }, [email]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = () => {
    setRefreshSpin(true);
    setTimeout(() => setRefreshSpin(false), 600);
  };

  const handleNewAddress = () => {
    initSession();
  };

  const handleSelectEmail = (e: Email) => {
    setSelectedEmail(e);
    setEmails(prev =>
      prev.map(em => (em.id === e.id ? { ...em, read: true } : em))
    );
  };

  const handleDeleteEmail = (id: string) => {
    setEmails(prev => prev.filter(em => em.id !== id));
    if (selectedEmail?.id === id) setSelectedEmail(null);
  };

  const unreadCount = emails.filter(e => !e.read).length;
  const progress = timeLeft / SESSION_DURATION;
  const circumference = 2 * Math.PI * 18;

  return (
    <div className="min-h-screen grid-bg relative">
      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 flex flex-col min-h-screen">
        {/* ─── HEADER ─── */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldIcon />
              </div>
              <div className="absolute -top-0.5 -right-0.5 status-dot" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Temp<span className="text-cyan-400">Vault</span> Mail
              </h1>
              <p className="text-xs text-slate-500 font-mono">disposable • encrypted • ephemeral</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-lg bg-vault-800 border border-vault-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
              title="How it works"
            >
              <InfoIcon />
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-vault-800 border border-vault-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
              title="Deploy on GitHub"
            >
              <GithubIcon />
            </a>
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-vault-800 border border-vault-700">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(37,99,235,0.15)" strokeWidth="2.5" />
                  <circle
                    cx="20" cy="20" r="18" fill="none"
                    stroke={timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#f59e0b' : '#22d3ee'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    className="timer-ring"
                  />
                </svg>
                <ClockIcon />
              </div>
              <span className={`font-mono text-sm font-semibold ${timeLeft < 60 ? 'text-red-400' : timeLeft < 180 ? 'text-amber-400' : 'text-cyan-400'}`}>
                {formatTimeLeft(timeLeft)}
              </span>
            </div>
          </div>
        </header>

        {/* ─── INFO PANEL ─── */}
        {showInfo && (
          <div className="mb-6 animate-slide-up">
            <div className="rounded-xl bg-vault-850 border border-vault-700 p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <InfoIcon /> How TempVault Mail Works
                </h3>
                <button onClick={() => setShowInfo(false)} className="text-slate-500 hover:text-white transition-colors">
                  <XIcon />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="info-card">
                  <div className="text-2xl mb-2">🎲</div>
                  <h4 className="text-cyan-400 font-semibold text-sm mb-1">Instant Generation</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Random email address generated instantly. No signup, no personal data. Use it anywhere.</p>
                </div>
                <div className="info-card">
                  <div className="text-2xl mb-2">📬</div>
                  <h4 className="text-cyan-400 font-semibold text-sm mb-1">Receive Emails</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Incoming emails appear in real-time. Read, inspect, and delete. Perfect for signups and verifications.</p>
                </div>
                <div className="info-card">
                  <div className="text-2xl mb-2">💀</div>
                  <h4 className="text-cyan-400 font-semibold text-sm mb-1">Auto-Destruct</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Session expires in 10 minutes. All data wiped. No traces. No logs. Complete ephemerality.</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-vault-900 border border-amber-500/20">
                <p className="text-amber-400 text-xs font-medium flex items-center gap-2">
                  ⚠️ This is a <strong>frontend demo</strong> built with React + Vite + Tailwind. 
                  A real temp mail service requires a backend mail server (SMTP), DNS MX records, and server infrastructure.
                  This demonstrates the UI/UX concept — deployable on GitHub Pages.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── EMAIL ADDRESS BAR ─── */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="rounded-xl bg-vault-850 border border-vault-700 p-4 glow-blue animate-pulse-glow">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 flex items-center gap-3 bg-vault-900 rounded-lg px-4 py-3 border border-vault-700">
                <MailIcon />
                <span className="font-mono text-sm sm:text-base text-cyan-300 font-medium truncate flex-1 select-all">
                  {email}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyEmail}
                  className={`copy-btn flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500'
                  }`}
                >
                  {copied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy</>}
                </button>
                <button
                  onClick={handleRefresh}
                  className="p-3 rounded-lg bg-vault-800 border border-vault-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                  title="Refresh inbox"
                >
                  <div className={refreshSpin ? 'animate-spin' : ''} style={{ animationDuration: '0.6s' }}>
                    <RefreshIcon />
                  </div>
                </button>
                <button
                  onClick={handleNewAddress}
                  className="px-4 py-3 rounded-lg bg-vault-800 border border-vault-700 text-slate-400 hover:text-amber-400 hover:border-amber-400/30 transition-all text-sm font-medium whitespace-nowrap"
                  title="Generate new address"
                >
                  New ↻
                </button>
              </div>
            </div>
            {/* Status bar */}
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-2">
                <div className="status-dot" />
                <span className="text-xs text-slate-500">Waiting for incoming mail...</span>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <span className="notif-badge px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                    {unreadCount} new
                  </span>
                )}
                <span className="text-xs text-slate-600 font-mono">{emails.length} total</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          
          {/* ─── INBOX LIST ─── */}
          <div className="lg:col-span-2 rounded-xl bg-vault-850 border border-vault-700 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-vault-700 flex items-center justify-between bg-vault-800/50">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${newEmailFlash ? 'bg-emerald-400 animate-count-pulse' : 'bg-vault-600'}`} />
                Inbox
                {unreadCount > 0 && (
                  <span className="notif-badge ml-1 px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">
                {email.split('@')[1]}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ maxHeight: '520px' }}>
              {emails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="text-slate-700 mb-4 animate-float">
                    <InboxIcon />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">Inbox Empty</p>
                  <p className="text-slate-600 text-xs mt-1">Emails will appear here automatically</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-xs text-cyan-600">Listening for incoming mail...</span>
                  </div>
                </div>
              ) : (
                emails.map((em, idx) => (
                  <div
                    key={em.id}
                    onClick={() => handleSelectEmail(em)}
                    className={`email-row cursor-pointer px-4 py-3 border-b border-vault-700/50 animate-email-arrive ${
                      selectedEmail?.id === em.id ? 'active' : ''
                    } ${!em.read ? 'unread' : ''}`}
                    style={{ animationDelay: idx === 0 ? '0s' : `${idx * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm truncate ${!em.read ? 'text-white font-semibold' : 'text-slate-400 font-medium'}`}>
                            {em.fromName}
                          </span>
                          {em.hasAttachment && (
                            <span className="text-slate-600 flex-shrink-0"><PaperclipIcon /></span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 truncate ${!em.read ? 'text-slate-300' : 'text-slate-500'}`}>
                          {em.subject}
                        </p>
                        <p className="text-[10px] text-slate-600 mt-0.5 truncate font-mono">{em.from}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[10px] text-slate-600 font-mono">{formatTime(em.time)}</span>
                        {!em.read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ─── EMAIL VIEWER ─── */}
          <div className="lg:col-span-3 rounded-xl bg-vault-850 border border-vault-700 overflow-hidden flex flex-col scan-overlay relative">
            {selectedEmail ? (
              <>
                <div className="px-5 py-4 border-b border-vault-700 bg-vault-800/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 lg:hidden">
                        <button
                          onClick={() => setSelectedEmail(null)}
                          className="p-1 rounded-md text-slate-500 hover:text-white transition-colors"
                        >
                          <ArrowLeftIcon />
                        </button>
                        <span className="text-xs text-slate-600">Back to inbox</span>
                      </div>
                      <h3 className="text-base font-semibold text-white leading-snug">{selectedEmail.subject}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {selectedEmail.fromName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm text-slate-300 font-medium">{selectedEmail.fromName}</span>
                            <span className="text-xs text-slate-600 font-mono ml-2">&lt;{selectedEmail.from}&gt;</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-600 font-mono">{formatTime(selectedEmail.time)}</span>
                      <button
                        onClick={() => handleDeleteEmail(selectedEmail.id)}
                        className="p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 px-5 py-5 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-vault-900 border border-vault-700">
                    <span className="text-[10px] text-slate-600 font-mono">TO:</span>
                    <span className="text-xs text-cyan-400 font-mono">{email}</span>
                    {selectedEmail.hasAttachment && (
                      <span className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                        <PaperclipIcon /> 1 attachment
                      </span>
                    )}
                  </div>
                  <div
                    className="prose prose-invert prose-sm max-w-none
                      [&_p]:text-slate-300 [&_p]:leading-relaxed [&_p]:mb-3
                      [&_strong]:text-white
                      [&_code]:text-cyan-400 [&_code]:bg-vault-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
                      [&_a]:text-blue-400 [&_a]:no-underline [&_a:hover]:underline
                      [&_ul]:text-slate-300 [&_li]:mb-1
                      [&_span]:text-emerald-400"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                  />
                </div>

                <div className="px-5 py-3 border-t border-vault-700 bg-vault-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-600 font-mono tracking-wider uppercase">Message ID:</span>
                    <span className="text-[10px] text-slate-500 font-mono">{selectedEmail.id}</span>
                  </div>
                  <span className="text-[10px] text-emerald-500/60 font-mono">● simulated</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-20 h-20 rounded-2xl bg-vault-800 border border-vault-700 flex items-center justify-center mb-4">
                  <div className="text-slate-700">
                    <MailIcon />
                  </div>
                </div>
                <p className="text-slate-500 font-medium">Select an email to read</p>
                <p className="text-slate-600 text-sm mt-1">Click any message from the inbox</p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg bg-vault-800 border border-vault-700">
                    <span className="text-lg font-bold text-blue-400 font-mono">{emails.length}</span>
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">Total</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg bg-vault-800 border border-vault-700">
                    <span className="text-lg font-bold text-cyan-400 font-mono">{unreadCount}</span>
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">Unread</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg bg-vault-800 border border-vault-700">
                    <span className={`text-lg font-bold font-mono ${timeLeft < 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {Math.floor(timeLeft / 60)}m
                    </span>
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">Left</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <footer className="mt-8 py-6 border-t border-vault-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">🔐 Why Temp Mail?</h4>
              <ul className="space-y-1 text-xs text-slate-500">
                <li>→ Avoid spam in your real inbox</li>
                <li>→ Sign up for services anonymously</li>
                <li>→ Test email workflows during development</li>
                <li>→ Protect your privacy online</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">⚙️ Tech Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {['React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'GitHub Pages'].map(tech => (
                  <span key={tech} className="px-2 py-1 rounded-md bg-vault-800 border border-vault-700 text-[10px] text-slate-400 font-mono">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-slate-600">
                ✅ Yes — React works perfectly on GitHub Pages! Vite builds static HTML/CSS/JS files.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">📋 Platform Comparison</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Blogspot</span>
                  <span className="text-red-400 font-mono text-[10px]">❌ No React / No Backend</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">GitHub Pages</span>
                  <span className="text-emerald-400 font-mono text-[10px]">✅ React Static Sites</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Vercel / Netlify</span>
                  <span className="text-emerald-400 font-mono text-[10px]">✅ Full React + API</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Real Temp Mail</span>
                  <span className="text-amber-400 font-mono text-[10px]">⚠️ Needs VPS + SMTP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-vault-800 border border-vault-700 p-4 mb-5">
            <h4 className="text-sm font-semibold text-amber-400 mb-2">💡 To Build a REAL Temp Mail Service, You Need:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🖥️', title: 'VPS Server', desc: 'DigitalOcean, AWS, etc.' },
                { icon: '📧', title: 'SMTP Server', desc: 'Postfix, Haraka, Maddy' },
                { icon: '🌐', title: 'Domain + MX', desc: 'DNS MX records pointing to your server' },
                { icon: '🗄️', title: 'Database', desc: 'Redis/MongoDB for temp storage' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs text-white font-semibold">{item.title}</p>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <ShieldIcon />
              </div>
              <span className="text-xs text-slate-500">
                TempVault Mail — <span className="text-slate-400">React Demo</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-mono">
              Built to demonstrate: React ✅ on GitHub Pages | Temp Mail ❌ on Blogspot
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
