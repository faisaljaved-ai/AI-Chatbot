/* ==========================================================================
   FJ-TECH SOLUTIONS — REACT 18 FRONTEND APPLICATION (app.js)
   ========================================================================== */

const { useState, useEffect, useRef, useMemo } = React;

// Automatically resolve backend URL whether opened via http://localhost:3000 or file://
const API_BASE =
  window.location.protocol === 'file:' ||
  (window.location.port && window.location.port !== '3000')
    ? 'http://localhost:3000'
    : '';

const VOICE_PROFILES = [
  'ElevenLabs — Rachel (Warm & Professional)',
  'ElevenLabs — Adam (Executive & Confident)',
  'OpenAI Realtime — Nova (Ultra-Low Latency)',
  'Deepgram Aura — Asteria (Empathetic Care)',
  'Cartesia Sonic — British Luxury Concierge'
];

const DEFAULT_SCENARIOS = [
  { icon: '💰', label: 'Ask Pricing', prompt: 'How much do your services cost and do you take insurance?' },
  { icon: '📅', label: 'Book Tomorrow 10:30 AM', prompt: 'I want to book an appointment for tomorrow at 10:30 AM' },
  { icon: '🕒', label: 'Hours & Location', prompt: 'What are your opening hours and where are you located?' },
  { icon: '🚨', label: 'Urgent Escalation', prompt: 'I have an urgent emergency and need immediate help!' }
];

// ============================================================================
// 1. TOP MASTER AGENCY NAVIGATION BAR
// ============================================================================
function TopNavbar({
  masterAgency,
  activeTenant,
  tenants,
  onSwitchTenant,
  onOpenNewClient,
  onOpenBranding
}) {
  const totalTraffic =
    (masterAgency?.activeCallsToday || 0) + (masterAgency?.messagesHandled || 0);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070d]/90 backdrop-blur-xl">
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: FJ-Tech Solutions Master Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-10 h-10 rounded-xl brand-gradient p-[1.5px] shadow-lg">
            <div className="w-full h-full bg-[#05070d] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-br from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                FJ
              </span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#05070d]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white whitespace-nowrap">
                FJ-Tech Solutions
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                Master Agency
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block whitespace-nowrap">
              White-Label AI Voice &amp; Website Chatbot Reseller Studio
            </p>
          </div>
        </div>

        {/* Center: Unified Client Sub-Account Switcher Pill (Zero Overlap) */}
        <div className="flex items-center gap-2 bg-[#0c101b] border border-white/10 rounded-xl p-1.5 shadow-inner">
          {activeTenant && (
            <img
              src={activeTenant.logoUrl}
              alt={activeTenant.brandName}
              className="w-7 h-7 rounded-lg object-cover border border-white/15 shrink-0 bg-slate-800"
            />
          )}

          <div className="flex items-center gap-1.5 pl-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] text-slate-400 font-semibold hidden lg:inline whitespace-nowrap">
              Workspace:
            </span>
          </div>

          <select
            value={activeTenant?.id || ''}
            onChange={(e) => onSwitchTenant(e.target.value)}
            aria-label="Select Client Workspace"
            className="bg-[#131a29] hover:bg-[#192236] text-xs font-bold text-white rounded-lg px-2.5 py-1.5 border border-white/10 focus:outline-none focus:border-indigo-400 transition cursor-pointer max-w-[190px] sm:max-w-[235px] truncate"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.brandName}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenNewClient}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition flex items-center gap-1 shrink-0 whitespace-nowrap"
            title="Create New Client Sub-Account"
          >
            <span className="text-emerald-400 font-bold">+</span>
            <span>New Client</span>
          </button>
        </div>

        {/* Right: Agency Telemetry + White-Label Brand Customizer Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden xl:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#0c101b] border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-slate-400">Agency MRR:</span>
              <span className="font-mono font-bold text-emerald-400">
                ${Number(masterAgency?.mrr || 0).toLocaleString()}/mo
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-slate-400">Interactions:</span>
              <span className="font-mono font-bold text-cyan-300">
                {totalTraffic.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenBranding}
            className="brand-gradient hover:brightness-110 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap"
          >
            <span>🎨</span>
            <span>White-Label Branding</span>
          </button>
        </div>

      </div>
    </header>
  );
}

// ============================================================================
// 2. ACTIVE CLIENT WORKSPACE BANNER & KPI METRICS
// ============================================================================
function ClientHeroBanner({ activeTenant, onOpenBranding }) {
  if (!activeTenant) return null;

  const totalSessions = (activeTenant.agents || []).reduce(
    (sum, a) => sum + (a.interactions || 0),
    0
  );

  return (
    <section className="max-w-[1420px] w-full mx-auto px-4 sm:px-6 pt-5">
      <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none brand-gradient" />

        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          
          {/* Left: Client Brand Identity */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0 group cursor-pointer" onClick={onOpenBranding}>
              <img
                src={activeTenant.logoUrl}
                alt={activeTenant.brandName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/15 bg-slate-900 shadow-xl group-hover:scale-105 transition"
              />
              <span
                title="Customize Client Brand"
                className="absolute -bottom-1 -right-1 bg-[#0c101b] hover:bg-indigo-600 text-white text-[10px] p-1 rounded-lg border border-white/20 shadow"
              >
                ✏️
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Client White-Label Active
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 whitespace-nowrap">
                  {activeTenant.industry || 'Enterprise'}
                </span>
                <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md truncate max-w-[230px]">
                  {activeTenant.domain}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
                {activeTenant.brandName}
              </h1>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                Powered invisibly by <strong className="text-slate-200">FJ-Tech Solutions</strong> • Client sees 100% custom domain, logo &amp; color theme
              </p>
            </div>
          </div>

          {/* Right: 4 Clean KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <div className="glass-subpanel rounded-xl px-3.5 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Deployed Agents
              </span>
              <span className="text-lg font-extrabold text-white mt-0.5 block">
                {activeTenant.agents?.length || 0}
              </span>
            </div>

            <div className="glass-subpanel rounded-xl px-3.5 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Client Retainer
              </span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono mt-0.5 block">
                ${Number(activeTenant.monthlyRetainer || 1500).toLocaleString()}/mo
              </span>
            </div>

            <div className="glass-subpanel rounded-xl px-3.5 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Handled Sessions
              </span>
              <span className="text-lg font-extrabold text-cyan-300 font-mono mt-0.5 block">
                {totalSessions.toLocaleString()}
              </span>
            </div>

            <div className="glass-subpanel rounded-xl px-3.5 py-2.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Brand Palette
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-4 h-4 rounded-full border border-white/30 shadow"
                  style={{ backgroundColor: activeTenant.primaryColor }}
                  title={`Primary: ${activeTenant.primaryColor}`}
                />
                <span
                  className="w-4 h-4 rounded-full border border-white/30 shadow"
                  style={{ backgroundColor: activeTenant.accentColor }}
                  title={`Accent: ${activeTenant.accentColor}`}
                />
                <button
                  onClick={onOpenBranding}
                  className="text-[11px] text-indigo-300 hover:text-white font-bold underline ml-auto"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 3. LEFT AGENT STUDIO (TABBED: DEPLOYED ROSTER vs. DEPLOY NEW AGENT)
// ============================================================================
function AgentStudio({
  activeTenant,
  selectedAgentId,
  onSelectAgent,
  onDeleteAgent,
  onDeploySuccess,
  showToast
}) {
  const [studioTab, setStudioTab] = useState('roster'); // 'roster' | 'deploy'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'voice' | 'chatbot'

  // Form state for deploying a new agent
  const [agentType, setAgentType] = useState('voice');
  const [name, setName] = useState('');
  const [voiceId, setVoiceId] = useState(VOICE_PROFILES[0]);
  const [phoneNumber, setPhoneNumber] = useState('+1 (888) 640-9210');
  const [greeting, setGreeting] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const agents = activeTenant?.agents || [];
  const filteredAgents = useMemo(() => {
    if (filterType === 'all') return agents;
    return agents.filter((a) => a.type === filterType);
  }, [agents, filterType]);

  const generateRandomPhone = () => {
    const area = ['888', '800', '305', '415', '212'][Math.floor(Math.random() * 5)];
    const mid = Math.floor(200 + Math.random() * 700);
    const end = Math.floor(1000 + Math.random() * 8999);
    setPhoneNumber(`+1 (${area}) ${mid}-${end}`);
  };

  const applyPreset = (presetKey) => {
    const brand = activeTenant?.brandName || 'our company';
    if (presetKey === 'voice') {
      setAgentType('voice');
      setName('Clara - 24/7 Inbound Phone Closer');
      generateRandomPhone();
      setGreeting(
        `Thank you for calling ${brand}! This is Clara, your AI concierge. How can I assist you today?`
      );
      setSystemPrompt(
        `You are Clara, the 24/7 AI voice receptionist for ${brand}. Initial consultations cost $95 (waived when booking a full package starting at $499). Open Mon-Sat 8:00 AM to 7:00 PM. Qualify the caller's needs and offer to book an appointment for tomorrow at 10:30 AM or 2:00 PM.`
      );
    } else {
      setAgentType('chatbot');
      setName(`${brand.split(' ')[0]} Instant Web Quote Bot`);
      setPhoneNumber(`Embedded on ${activeTenant?.domain || 'clientwebsite.com'}`);
      setGreeting(
        `Hey there! 👋 Welcome to ${brand}. Would you like an instant price quote or available appointment times?`
      );
      setSystemPrompt(
        `You are the website AI chat concierge for ${brand}. Share instant pricing: Standard Package is $199, Executive VIP Package is $599. Ask for the visitor's name and phone number to send a $50 first-visit voucher.`
      );
    }
    showToast('✨ Preset filled! Click "Deploy & Test in Simulator" below.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeTenant) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/tenants/${activeTenant.id}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type: agentType,
          voiceId,
          phoneNumber,
          greeting,
          systemPrompt
        })
      });
      const data = await res.json();
      if (res.ok) {
        setName('');
        setGreeting('');
        setSystemPrompt('');
        setStudioTab('roster');
        onDeploySuccess(data.tenant, data.agent);
      } else {
        showToast(data.error || 'Failed to deploy agent');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEmbedCode = (e, agent) => {
    e.stopPropagation();
    const snippet = `<script src="https://cdn.fjtech.ai/widget.js" data-tenant="${activeTenant.id}" data-agent="${agent.id}"></script>`;
    navigator.clipboard?.writeText(snippet);
    showToast(`📋 Copied white-label embed snippet for "${agent.name}"!`);
  };

  return (
    <div className="lg:col-span-7 glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* Studio Top Bar */}
      <div className="px-5 py-3.5 border-b border-white/10 bg-[#080c14]/90 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-xl bg-[#05070d] border border-white/10">
          <button
            type="button"
            onClick={() => setStudioTab('roster')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              studioTab === 'roster'
                ? 'brand-gradient text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🤖 Active Client Agents</span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/30 text-white">
              {agents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStudioTab('deploy')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              studioTab === 'deploy'
                ? 'brand-gradient text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>➕ Deploy New Voice / Chat Agent</span>
          </button>
        </div>

        {/* Filter Pills when in Roster View */}
        {studioTab === 'roster' && (
          <div className="flex items-center gap-1 text-xs">
            {['all', 'voice', 'chatbot'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition ${
                  filterType === type
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'All' : type === 'voice' ? '📞 Voice' : '💬 Chat'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW 1: DEPLOYED AGENTS ROSTER */}
      {studioTab === 'roster' ? (
        <div className="p-5 space-y-3.5 animate-fade-slide">
          {filteredAgents.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/15 text-slate-400 text-xs">
              No matching agents found for <strong>{activeTenant?.brandName}</strong>. Click{' '}
              <button
                onClick={() => setStudioTab('deploy')}
                className="text-indigo-400 font-bold underline"
              >
                + Deploy New Voice / Chat Agent
              </button>{' '}
              to launch one!
            </div>
          ) : (
            filteredAgents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              const isVoice = agent.type === 'voice';

              return (
                <div
                  key={agent.id}
                  onClick={() => onSelectAgent(agent)}
                  className={`cursor-pointer rounded-xl p-4 transition-all border ${
                    isSelected
                      ? 'border-indigo-400/80 bg-indigo-500/[0.09] brand-glow-card'
                      : 'border-white/10 bg-[#080b12]/80 hover:border-white/25 hover:bg-[#0b101b]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                          isVoice
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {isVoice ? '📞' : '💬'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-white truncate">
                            {agent.name}
                          </h4>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md whitespace-nowrap ${
                              isVoice
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'bg-cyan-500/20 text-cyan-300'
                            }`}
                          >
                            {isVoice ? 'Voice Call Agent' : 'Website Chatbot'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-mono">
                          <span>{agent.phoneNumber}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">
                            {(agent.interactions || 0).toLocaleString()} sessions
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <button
                        type="button"
                        onClick={(e) => copyEmbedCode(e, agent)}
                        title="Copy Client Embed / Webhook Snippet"
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition whitespace-nowrap"
                      >
                        📋 Code
                      </button>

                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                          isSelected
                            ? 'brand-gradient text-white shadow'
                            : 'bg-white/5 text-slate-300 border border-white/10'
                        }`}
                      >
                        {isSelected ? '● Live in Simulator' : '▶ Test Agent'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAgent(agent.id);
                        }}
                        title="Remove Agent"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Prompt Preview Footer */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                    <p className="line-clamp-1">
                      <strong className="text-slate-200">System Prompt:</strong>{' '}
                      {agent.systemPrompt}
                    </p>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      {agent.voiceId}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {/* Provision CTA */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setStudioTab('deploy')}
              className="w-full py-3 px-4 rounded-xl border border-dashed border-white/15 hover:border-indigo-400/60 bg-white/[0.02] hover:bg-indigo-500/10 text-xs font-bold text-slate-300 hover:text-white transition flex items-center justify-center gap-2"
            >
              <span>
                ➕ Deploy Another AI Voice Call Agent or Website Chatbot for{' '}
                <strong className="text-white">{activeTenant?.brandName}</strong>
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* VIEW 2: DEPLOY NEW AGENT FORM */
        <div className="p-5 animate-fade-slide">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Provision New AI Agent for {activeTenant?.brandName}
              </h2>
              <p className="text-xs text-slate-400">
                Configure voice profile, phone number or web embed, and knowledge prompt
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">1-Click Template:</span>
              <button
                type="button"
                onClick={() => applyPreset('voice')}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-slate-200 border border-white/10 transition font-semibold"
              >
                📞 Voice Closer
              </button>
              <button
                type="button"
                onClick={() => applyPreset('chatbot')}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-200 border border-white/10 transition font-semibold"
              >
                💬 Web Quote Bot
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Agent Channel Switcher */}
            <div className="grid grid-cols-2 gap-2.5 p-1 bg-[#05070d] rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setAgentType('voice');
                  generateRandomPhone();
                }}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  agentType === 'voice'
                    ? 'brand-gradient text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📞 AI Voice Call Agent (PSTN / SIP)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgentType('chatbot');
                  setPhoneNumber(`Embedded on ${activeTenant?.domain || 'clientwebsite.com'}`);
                }}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  agentType === 'chatbot'
                    ? 'brand-gradient text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>💬 AI Website &amp; SMS Chatbot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Agent Name &amp; Role *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Aria - 24/7 Appointment Qualifier"
                  className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Neural Voice ID / Engine
                </label>
                <select
                  value={voiceId}
                  onChange={(e) => setVoiceId(e.target.value)}
                  className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
                >
                  {VOICE_PROFILES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {agentType === 'voice' ? 'Twilio Phone Number / SIP Line' : 'Website Embed Domain'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                  {agentType === 'voice' && (
                    <button
                      type="button"
                      onClick={generateRandomPhone}
                      title="Generate Toll-Free Number"
                      className="px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 border border-white/10 shrink-0 font-semibold"
                    >
                      🎲 #
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Opening Greeting Message
                </label>
                <input
                  type="text"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  placeholder="Hi! Thanks for reaching out. How can I help you today?"
                  className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  System Prompt, Pricing &amp; Qualification Rules *
                </label>
                <span className="text-[11px] text-indigo-300">
                  Powers the live simulator responses
                </span>
              </div>
              <textarea
                rows="3"
                required
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Include service prices (e.g. $125 consultation), hours (Mon-Sat 8am-6pm), and booking instructions..."
                className="w-full rounded-xl bg-[#05070d] border border-white/10 p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStudioTab('roster')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 border border-white/10"
              >
                ← Back to Agents
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="brand-gradient hover:brightness-110 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <span>{isSubmitting ? 'Deploying...' : '🚀 Deploy & Test in Simulator'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. RIGHT INTERACTIVE VOICE & CHAT SIMULATOR
// ============================================================================
function LiveSimulator({
  activeTenant,
  selectedAgent,
  onSelectAgentId,
  onStatsUpdated,
  showToast
}) {
  const [simMode, setSimMode] = useState('chat'); // 'chat' | 'voice' | 'webhook'
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [scenarios, setScenarios] = useState(DEFAULT_SCENARIOS);
  const [webhookPayload, setWebhookPayload] = useState(null);

  const chatScrollRef = useRef(null);

  // Reset conversation whenever tenant or selected agent changes
  useEffect(() => {
    stopSpeech();
    if (!selectedAgent || !activeTenant) {
      setMessages([]);
      return;
    }

    const openingText =
      selectedAgent.greeting ||
      `Hello! Welcome to ${activeTenant.brandName}. How can I assist you today?`;

    setMessages([
      {
        id: 'msg-init',
        role: 'agent',
        text: openingText,
        meta: 'Greeting Delivered • Ready for Live Test'
      }
    ]);
    setScenarios(DEFAULT_SCENARIOS);
    setWebhookPayload({
      status: 'READY_FOR_WEBHOOK',
      tenant_id: activeTenant.id,
      tenant_brand: activeTenant.brandName,
      agent_id: selectedAgent.id,
      agent_name: selectedAgent.name,
      channel: selectedAgent.type,
      endpoint: selectedAgent.phoneNumber
    });
  }, [activeTenant?.id, selectedAgent?.id]);

  // Auto-scroll chat container
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Live Call Timer when in Voice Mode
  useEffect(() => {
    if (simMode !== 'voice') {
      setCallSeconds(0);
      return;
    }
    setCallSeconds(1);
    const interval = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [simMode, selectedAgent?.id]);

  const formatTimer = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.03;
    window.speechSynthesis.speak(utter);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const sendMessage = async (textToSend) => {
    const trimmed = (textToSend || '').trim();
    if (!trimmed || !activeTenant || !selectedAgent) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/simulate/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: activeTenant.id,
          agentId: selectedAgent.id,
          userMessage: trimmed,
          mode: simMode,
          callHistory: [...messages, userMsg]
        })
      });

      const data = await res.json();
      setIsTyping(false);

      if (res.ok) {
        const metaInfo = `Intent: ${data.intentDetected} (${Math.round(
          data.confidence * 100
        )}%) • ${data.latencyMs}ms`;

        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'agent',
            text: data.reply,
            meta: metaInfo
          }
        ]);

        setWebhookPayload(data.webhookPayloadInspector);

        if (Array.isArray(data.suggestedActions) && data.suggestedActions.length > 0) {
          setScenarios(
            data.suggestedActions.map((act) => ({
              icon: '✨',
              label: act,
              prompt: act
            }))
          );
        }

        onStatsUpdated(selectedAgent.id, data.updatedStats);

        if (ttsEnabled || simMode === 'voice') {
          speakText(data.reply);
        }
      }
    } catch (err) {
      setIsTyping(false);
      console.error(err);
    }
  };

  const handleReset = () => {
    stopSpeech();
    if (!selectedAgent || !activeTenant) return;
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'agent',
        text:
          selectedAgent.greeting ||
          `Hello! Welcome to ${activeTenant.brandName}. How can I assist you today?`,
        meta: 'Session Reset • Ready'
      }
    ]);
    setScenarios(DEFAULT_SCENARIOS);
    showToast('Simulator session reset');
  };

  const handleMicInput = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      showToast('Browser STT requires Chrome/Edge — or type below!');
      return;
    }
    const rec = new SpeechRec();
    rec.lang = 'en-US';
    rec.interimResults = false;
    setIsListeningMic(true);

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setIsListeningMic(false);
      sendMessage(transcript);
    };
    rec.onerror = () => setIsListeningMic(false);
    rec.onend = () => setIsListeningMic(false);
    rec.start();
  };

  const agents = activeTenant?.agents || [];

  return (
    <div className="lg:col-span-5 glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[640px]">
      
      {/* Row 1: Simulator Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#080c14]/95 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={activeTenant?.logoUrl}
              alt="Logo"
              className="w-9 h-9 rounded-xl object-cover border border-white/15 bg-slate-800"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#05070d]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                Live Sandbox
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono text-emerald-400">
                ~{selectedAgent?.avgLatencyMs || 360}ms RTF
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">
              {selectedAgent ? selectedAgent.name : 'Deploy an Agent'}
            </h3>
          </div>
        </div>

        {/* Agent Switcher Dropdown */}
        <select
          value={selectedAgent?.id || ''}
          onChange={(e) => onSelectAgentId(e.target.value)}
          aria-label="Select Simulator Agent"
          className="bg-[#05070d] hover:bg-[#0d1320] text-xs font-semibold text-slate-200 border border-white/10 rounded-xl px-2.5 py-1.5 max-w-[175px] truncate focus:outline-none focus:border-indigo-400 shrink-0 cursor-pointer"
        >
          {agents.length === 0 ? (
            <option value="">No Agents</option>
          ) : (
            agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.type === 'voice' ? '📞' : '💬'} {a.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Row 2: Single-Line Mode Switcher Bar (Zero Wrapping!) */}
      <div className="px-4 py-2 bg-[#05070d]/90 border-b border-white/10 flex items-center justify-between gap-2">
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0c111d] border border-white/10 flex-1">
          {[
            { id: 'chat', label: '💬 Chat' },
            { id: 'voice', label: '📞 Voice Call' },
            { id: 'webhook', label: '⚡ Webhook' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSimMode(tab.id)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition text-center whitespace-nowrap ${
                simMode === tab.id
                  ? 'brand-gradient text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (ttsEnabled) stopSpeech();
              setTtsEnabled(!ttsEnabled);
            }}
            title="Toggle Spoken Voice Audio"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition whitespace-nowrap ${
              ttsEnabled
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            {ttsEnabled ? '🔊 On' : '🔇 Off'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reset Conversation"
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 whitespace-nowrap transition"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Optional Live Voice Call Visualizer Deck */}
      {simMode === 'voice' && (
        <div className="bg-gradient-to-b from-[#05070d] to-[#0b111e] border-b border-white/10 px-4 py-3 animate-fade-slide">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SIP Audio Connected
            </span>
            <span className="font-mono text-slate-300 text-[11px]">
              {selectedAgent?.phoneNumber}
            </span>
            <span className="font-mono text-indigo-300 font-bold">
              {formatTimer(callSeconds)}
            </span>
          </div>

          <div className="h-9 flex items-center justify-center gap-1.5 my-1">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-8 rounded-full brand-gradient eq-bar"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-2">
            <button
              type="button"
              onClick={handleMicInput}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                isListeningMic
                  ? 'bg-rose-500/25 text-rose-200 border-rose-500/50 animate-pulse'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {isListeningMic
                ? '🔴 Listening... Speak Now'
                : '🎙️ Click to Speak (or Type Below)'}
            </button>
            <button
              type="button"
              onClick={stopSpeech}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-200 border border-white/10 text-xs font-semibold transition"
            >
              ⏹ Mute
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area: Webhook JSON vs. Conversation Transcript */}
      {simMode === 'webhook' ? (
        <div className="flex-1 bg-[#05070d] p-4 overflow-y-auto custom-scroll font-mono text-xs animate-fade-slide">
          <div className="flex items-center justify-between mb-2">
            <span className="text-indigo-400 font-bold">
              POST /api/simulate/webhook — Live Payload
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
              200 OK
            </span>
          </div>
          <pre className="text-slate-300 bg-[#0b101b] p-3.5 rounded-xl border border-white/10 overflow-x-auto leading-relaxed">
            {JSON.stringify(webhookPayload || {}, null, 2)}
          </pre>
        </div>
      ) : (
        <div
          ref={chatScrollRef}
          className="flex-1 p-4 overflow-y-auto custom-scroll space-y-3 bg-[#05070d]/50"
        >
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="flex justify-end animate-fade-slide">
                <div className="max-w-[82%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-xs sm:text-sm text-white font-medium shadow brand-gradient">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex items-start gap-2.5 animate-fade-slide">
                <div className="w-7 h-7 rounded-lg bg-[#111827] border border-white/10 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {selectedAgent?.type === 'voice' ? '📞' : '🤖'}
                </div>
                <div className="max-w-[85%]">
                  <div className="rounded-2xl rounded-tl-sm bg-[#111827] border border-white/10 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 leading-relaxed shadow">
                    {m.text}
                  </div>
                  {m.meta && (
                    <div className="text-[10px] font-mono text-slate-400 mt-1 px-1">
                      {m.meta}
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-2">
              <div className="flex gap-1 bg-[#111827] border border-white/10 px-3 py-2 rounded-2xl">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 typing-dot" />
              </div>
              <span className="text-[11px] font-mono">Processing prompt...</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Interactive Scenario Pills (Clean Wrap Grid) */}
      <div className="px-3.5 py-2.5 bg-[#080c14] border-t border-white/10">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Interactive Test Scenarios:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {scenarios.map((sc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => sendMessage(sc.prompt)}
              className="glass-pill text-[11px] px-2.5 py-1 rounded-lg text-slate-200 font-medium"
            >
              {sc.icon} {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Message Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(userInput);
        }}
        className="p-3 bg-[#05070d] border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message or caller question..."
          className="flex-1 rounded-xl bg-[#0d1320] border border-white/10 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
        />
        <button
          type="submit"
          className="brand-gradient hover:brightness-110 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition shrink-0"
        >
          <span>Send</span>
          <span>→</span>
        </button>
      </form>

    </div>
  );
}

// ============================================================================
// 5. MODAL: WHITE-LABEL BRANDING CUSTOMIZER (WITH LIVE THEME PRESETS)
// ============================================================================
function BrandingModal({ isOpen, activeTenant, onClose, onSaved }) {
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [monthlyRetainer, setMonthlyRetainer] = useState(1500);
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#06b6d4');

  useEffect(() => {
    if (activeTenant && isOpen) {
      setBrandName(activeTenant.brandName || '');
      setLogoUrl(activeTenant.logoUrl || '');
      setDomain(activeTenant.domain || '');
      setMonthlyRetainer(activeTenant.monthlyRetainer || 1500);
      setPrimaryColor(activeTenant.primaryColor || '#6366f1');
      setAccentColor(activeTenant.accentColor || '#06b6d4');
    }
  }, [activeTenant, isOpen]);

  if (!isOpen || !activeTenant) return null;

  const THEME_PALETTES = [
    { name: 'Cyber Indigo', primary: '#6366f1', accent: '#06b6d4' },
    { name: 'Emerald Executive', primary: '#10b981', accent: '#f59e0b' },
    { name: 'Solaris Sunset', primary: '#f97316', accent: '#eab308' },
    { name: 'Royal Rose', primary: '#ec4899', accent: '#8b5cf6' }
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/tenants/${activeTenant.id}/branding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          logoUrl,
          domain,
          monthlyRetainer: Number(monthlyRetainer),
          primaryColor,
          accentColor
        })
      });
      const data = await res.json();
      if (res.ok) {
        onSaved(data.tenant, data.masterAgency);
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-slide">
      <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b101b] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
              FJ-Tech White-Label Engine
            </span>
            <h3 className="text-lg font-extrabold text-white">
              Customize Client Brand Identity
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Client Company / Brand Name *
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Brand Logo URL *
              </label>
              <div className="flex gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() =>
                    setLogoUrl(
                      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=120&auto=format&fit=crop&q=80'
                    )
                  }
                  className="text-indigo-400 hover:underline"
                >
                  Dental
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLogoUrl(
                      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=80'
                    )
                  }
                  className="text-indigo-400 hover:underline"
                >
                  Realty
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLogoUrl(
                      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&auto=format&fit=crop&q=80'
                    )
                  }
                  className="text-indigo-400 hover:underline"
                >
                  Legal
                </button>
              </div>
            </div>
            <input
              type="url"
              required
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Custom White-Label Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Monthly Retainer ($/mo)
              </label>
              <input
                type="number"
                value={monthlyRetainer}
                onChange={(e) => setMonthlyRetainer(e.target.value)}
                className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* 1-Click Theme Palette Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Quick Theme Palettes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEME_PALETTES.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setPrimaryColor(p.primary);
                    setAccentColor(p.accent);
                  }}
                  className="p-2 rounded-xl bg-[#05070d] border border-white/10 hover:border-white/30 flex items-center gap-2 text-xs text-slate-200 transition"
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${p.primary}, ${p.accent})`
                    }}
                  />
                  <span className="truncate text-[11px] font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-2.5 bg-[#05070d] border border-white/10 rounded-xl p-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-7 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">{primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Accent Glow Color
              </label>
              <div className="flex items-center gap-2.5 bg-[#05070d] border border-white/10 rounded-xl p-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-7 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">{accentColor}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="brand-gradient hover:brightness-110 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg"
            >
              Save &amp; Apply Branding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 6. MODAL: ADD NEW RESELLER CLIENT WORKSPACE
// ============================================================================
function NewClientModal({ isOpen, onClose, onCreated }) {
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [monthlyRetainer, setMonthlyRetainer] = useState(1750);
  const [logoUrl, setLogoUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          industry,
          monthlyRetainer: Number(monthlyRetainer),
          logoUrl
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBrandName('');
        setIndustry('');
        setLogoUrl('');
        onCreated(data);
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-slide">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0b101b] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              Multi-Tenant Sub-Account
            </span>
            <h3 className="text-lg font-extrabold text-white">Add New Reseller Client</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Client Business Name *
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g., Sterling Injury Law Group"
              className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Legal / Law Firm"
                className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Retainer ($/mo)
              </label>
              <input
                type="number"
                value={monthlyRetainer}
                onChange={(e) => setMonthlyRetainer(e.target.value)}
                className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Logo URL (Optional)
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120"
              className="w-full rounded-xl bg-[#05070d] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="brand-gradient px-5 py-2 rounded-xl text-xs font-bold text-white"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 7. ROOT PLATFORM COMPONENT
// ============================================================================
function App() {
  const [masterAgency, setMasterAgency] = useState({});
  const [tenants, setTenants] = useState([]);
  const [activeTenant, setActiveTenant] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [isBrandingOpen, setIsBrandingOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3400);
  };

  // Load initial multi-tenant state from Express backend
  useEffect(() => {
    fetch(`${API_BASE}/api/state`)
      .then((r) => r.json())
      .then((data) => {
        setMasterAgency(data.masterAgency);
        setTenants(data.tenants);
        setActiveTenant(data.activeTenant);
        setSelectedAgentId(data.activeTenant?.agents?.[0]?.id || null);
      })
      .catch((err) => console.error('Failed to connect to backend:', err));
  }, []);

  // Dynamically sync CSS variables when active client brand changes
  useEffect(() => {
    if (activeTenant) {
      document.documentElement.style.setProperty(
        '--brand-primary',
        activeTenant.primaryColor || '#6366f1'
      );
      document.documentElement.style.setProperty(
        '--brand-accent',
        activeTenant.accentColor || '#06b6d4'
      );
    }
  }, [activeTenant]);

  const selectedAgent = useMemo(() => {
    if (!activeTenant || !activeTenant.agents) return null;
    return (
      activeTenant.agents.find((a) => a.id === selectedAgentId) ||
      activeTenant.agents[0] ||
      null
    );
  }, [activeTenant, selectedAgentId]);

  const handleSwitchTenant = async (tenantId) => {
    try {
      const res = await fetch(`${API_BASE}/api/tenants/switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId })
      });
      const data = await res.json();
      if (res.ok) {
        setActiveTenant(data.activeTenant);
        setSelectedAgentId(data.activeTenant?.agents?.[0]?.id || null);
        showToast(`Switched workspace to ${data.activeTenant.brandName}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    if (!activeTenant) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/tenants/${activeTenant.id}/agents/${agentId}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (res.ok) {
        setActiveTenant(data.tenant);
        setTenants((prev) =>
          prev.map((t) => (t.id === data.tenant.id ? data.tenant : t))
        );
        if (selectedAgentId === agentId) {
          setSelectedAgentId(data.tenant.agents?.[0]?.id || null);
        }
        showToast('🗑️ Agent removed from workspace');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeploySuccess = (updatedTenant, newAgent) => {
    setActiveTenant(updatedTenant);
    setTenants((prev) =>
      prev.map((t) => (t.id === updatedTenant.id ? updatedTenant : t))
    );
    setSelectedAgentId(newAgent.id);
    showToast(`🚀 Deployed "${newAgent.name}" & loaded into Simulator!`);
  };

  const handleStatsUpdated = (agentId, updatedStats) => {
    setMasterAgency((prev) => ({
      ...prev,
      activeCallsToday: updatedStats.activeCallsToday,
      messagesHandled: updatedStats.messagesHandled
    }));
    setActiveTenant((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        agents: prev.agents.map((a) =>
          a.id === agentId
            ? { ...a, interactions: updatedStats.agentInteractions }
            : a
        )
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-grid-pattern">
      <TopNavbar
        masterAgency={masterAgency}
        activeTenant={activeTenant}
        tenants={tenants}
        onSwitchTenant={handleSwitchTenant}
        onOpenNewClient={() => setIsNewClientOpen(true)}
        onOpenBranding={() => setIsBrandingOpen(true)}
      />

      <ClientHeroBanner
        activeTenant={activeTenant}
        onOpenBranding={() => setIsBrandingOpen(true)}
      />

      <main className="max-w-[1420px] w-full mx-auto px-4 sm:px-6 py-5 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <AgentStudio
          activeTenant={activeTenant}
          selectedAgentId={selectedAgent?.id}
          onSelectAgent={(agent) => {
            setSelectedAgentId(agent.id);
            showToast(`Simulating: ${agent.name}`);
          }}
          onDeleteAgent={handleDeleteAgent}
          onDeploySuccess={handleDeploySuccess}
          showToast={showToast}
        />

        <LiveSimulator
          activeTenant={activeTenant}
          selectedAgent={selectedAgent}
          onSelectAgentId={(id) => setSelectedAgentId(id)}
          onStatsUpdated={handleStatsUpdated}
          showToast={showToast}
        />
      </main>

      <BrandingModal
        isOpen={isBrandingOpen}
        activeTenant={activeTenant}
        onClose={() => setIsBrandingOpen(false)}
        onSaved={(updatedTenant, updatedAgency) => {
          setActiveTenant(updatedTenant);
          setMasterAgency(updatedAgency);
          setTenants((prev) =>
            prev.map((t) => (t.id === updatedTenant.id ? updatedTenant : t))
          );
          showToast(`✨ Updated white-label branding for ${updatedTenant.brandName}!`);
        }}
      />

      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onCreated={(data) => {
          setActiveTenant(data.activeTenant);
          setTenants(data.tenants);
          setMasterAgency(data.masterAgency);
          setSelectedAgentId(null);
          showToast(`🎉 Created client workspace "${data.activeTenant.brandName}"!`);
        }}
      />

      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0b101b] border border-indigo-500/50 text-white text-xs font-bold shadow-2xl animate-fade-slide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

