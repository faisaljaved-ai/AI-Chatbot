const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_DIR));

// ==========================================
// MULTI-TENANT DATA STORE (IN-MEMORY + SEED)
// ==========================================
let platformState = {
  masterAgency: {
    name: "FJ-Tech Solutions",
    tagline: "Enterprise White-Label AI Voice & Chatbot Infrastructure",
    mrr: 14850,
    activeCallsToday: 1284,
    messagesHandled: 48920
  },
  activeTenantId: "tenant-apex",
  tenants: [
    {
      id: "tenant-apex",
      brandName: "Apex Dental & Implant Studio",
      industry: "Healthcare / Dental",
      domain: "ai.apexdentalstudio.com",
      logoUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=120&auto=format&fit=crop&q=80",
      primaryColor: "#6366f1",
      accentColor: "#06b6d4",
      monthlyRetainer: 1500,
      status: "Active",
      agents: [
        {
          id: "agent-101",
          name: "Sophia - 24/7 Patient Receptionist",
          type: "voice",
          voiceId: "ElevenLabs - Rachel (Warm & Professional)",
          phoneNumber: "+1 (888) 412-9040",
          greeting: "Thank you for calling Apex Dental Studio! This is Sophia, your AI care coordinator. How can I help you with your smile today?",
          systemPrompt: "You are Sophia, the senior AI voice receptionist at Apex Dental & Implant Studio. You book teeth cleanings, emergency root canals, and cosmetic implant consultations. Dental cleanings cost $125 without insurance. We accept Delta Dental, Cigna, and Aetna. Open Mon-Sat 8am to 6pm. Always ask for the patient's full name and preferred time slot.",
          status: "Deployed",
          interactions: 642,
          avgLatencyMs: 410,
          createdAt: "2026-10-12"
        },
        {
          id: "agent-102",
          name: "Apex Web Concierge & Insurance Verifier",
          type: "chatbot",
          voiceId: "N/A (Web Widget)",
          phoneNumber: "Embedded on apexdentalstudio.com",
          greeting: "Hi there! Welcome to Apex Dental Studio. Need an instant quote on veneers, Invisalign, or an emergency appointment?",
          systemPrompt: "You are the website AI chat assistant for Apex Dental Studio. Answer questions concisely about Invisalign ($3,900 all-inclusive), Zoom Whitening ($299), and same-day emergency appointments. Offer to schedule a free 15-minute smile consultation.",
          status: "Deployed",
          interactions: 1840,
          avgLatencyMs: 280,
          createdAt: "2026-10-15"
        }
      ]
    },
    {
      id: "tenant-vanguard",
      brandName: "Vanguard Luxury Realty Group",
      industry: "Real Estate",
      domain: "concierge.vanguardluxury.io",
      logoUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=80",
      primaryColor: "#10b981",
      accentColor: "#f59e0b",
      monthlyRetainer: 2200,
      status: "Active",
      agents: [
        {
          id: "agent-201",
          name: "Marcus - Inbound Lead Qualifier",
          type: "voice",
          voiceId: "Deepgram Aura - Orion (Executive Male)",
          phoneNumber: "+1 (305) 990-8122",
          greeting: "Hello, you've reached Vanguard Luxury Realty. I'm Marcus, our automated property specialist. Are you looking to buy, sell, or schedule a private penthouse viewing?",
          systemPrompt: "You are Marcus, an executive real estate AI voice agent for Vanguard Luxury Realty in Miami & Dubai. Qualify buyers by asking for their budget range ($1M-$25M+), preferred neighborhood (Brickell, Star Island, Palm Jumeirah), and timeline. Offer to book a VIP showing with a senior broker.",
          status: "Deployed",
          interactions: 389,
          avgLatencyMs: 390,
          createdAt: "2026-10-18"
        },
        {
          id: "agent-202",
          name: "24/7 MLS Property Finder Bot",
          type: "chatbot",
          voiceId: "N/A (Omnichannel Chat)",
          phoneNumber: "WhatsApp & Web Widget",
          greeting: "Welcome to Vanguard Luxury Realty! Tell me how many bedrooms and which waterfront area you're exploring, and I'll send you off-market listings.",
          systemPrompt: "You are Vanguard Luxury Realty's instant property concierge. Share featured listings like The Residences at Brickell ($3.4M, 4BD/4.5BA private elevator) and Coral Gables Waterfront Villa ($6.8M, private dock). Collect the prospect's email or WhatsApp number to send PDF brochures.",
          status: "Deployed",
          interactions: 2190,
          avgLatencyMs: 245,
          createdAt: "2026-10-20"
        }
      ]
    },
    {
      id: "tenant-solaris",
      brandName: "Solaris Home Energy & HVAC",
      industry: "Home Services & Solar",
      domain: "portal.solarishome.energy",
      logoUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=120&auto=format&fit=crop&q=80",
      primaryColor: "#f97316",
      accentColor: "#eab308",
      monthlyRetainer: 1850,
      status: "Active",
      agents: [
        {
          id: "agent-301",
          name: "Elena - Solar Rebate & Dispatch Caller",
          type: "voice",
          voiceId: "OpenAI Realtime - Nova (Energetic)",
          phoneNumber: "+1 (800) 755-2390",
          greeting: "Hi! Thanks for calling Solaris Home Energy. I'm Elena! Are you calling about our 24/7 emergency HVAC repair or the 30% Federal Solar Tax Credit assessment?",
          systemPrompt: "You are Elena from Solaris Home Energy. You dispatch emergency AC/heating technicians within 2 hours ($89 diagnostic fee waived with repair) and qualify homeowners for $0-down solar panel installations. Ask for the homeowner's average monthly electric bill and roof age.",
          status: "Deployed",
          interactions: 915,
          avgLatencyMs: 425,
          createdAt: "2026-10-24"
        }
      ]
    }
  ]
};

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Get full platform state (Master agency + all client tenants + active tenant)
app.get('/api/state', (req, res) => {
  const activeTenant = platformState.tenants.find(t => t.id === platformState.activeTenantId) || platformState.tenants[0];
  res.json({
    masterAgency: platformState.masterAgency,
    activeTenantId: activeTenant.id,
    activeTenant,
    tenants: platformState.tenants
  });
});

// 2. Switch active client tenant workspace
app.post('/api/tenants/switch', (req, res) => {
  const { tenantId } = req.body;
  const found = platformState.tenants.find(t => t.id === tenantId);
  if (!found) {
    return res.status(404).json({ error: 'Client workspace not found' });
  }
  platformState.activeTenantId = found.id;
  res.json({
    message: `Switched workspace to ${found.brandName}`,
    activeTenant: found
  });
});

// 3. Create a brand new client tenant workspace
app.post('/api/tenants', (req, res) => {
  const { brandName, industry, domain, logoUrl, primaryColor, accentColor, monthlyRetainer } = req.body;
  if (!brandName || !brandName.trim()) {
    return res.status(400).json({ error: 'Client brand name is required' });
  }

  const newTenant = {
    id: `tenant-${Date.now()}`,
    brandName: brandName.trim(),
    industry: industry || 'Commercial Enterprise',
    domain: domain || `ai.${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    logoUrl: logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    primaryColor: primaryColor || '#6366f1',
    accentColor: accentColor || '#06b6d4',
    monthlyRetainer: Number(monthlyRetainer) || 1500,
    status: 'Active',
    agents: []
  };

  platformState.tenants.push(newTenant);
  platformState.activeTenantId = newTenant.id;
  platformState.masterAgency.mrr += newTenant.monthlyRetainer;

  res.status(201).json({
    message: 'New white-label client tenant created',
    activeTenant: newTenant,
    tenants: platformState.tenants,
    masterAgency: platformState.masterAgency
  });
});

// 4. Update white-label branding for a tenant (brand name, logo URL, primary/accent colors, domain)
app.put('/api/tenants/:tenantId/branding', (req, res) => {
  const { tenantId } = req.params;
  const { brandName, logoUrl, primaryColor, accentColor, domain, industry, monthlyRetainer } = req.body;

  const tenant = platformState.tenants.find(t => t.id === tenantId);
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  if (brandName !== undefined && brandName.trim() !== '') tenant.brandName = brandName.trim();
  if (logoUrl !== undefined && logoUrl.trim() !== '') tenant.logoUrl = logoUrl.trim();
  if (primaryColor !== undefined) tenant.primaryColor = primaryColor;
  if (accentColor !== undefined) tenant.accentColor = accentColor;
  if (domain !== undefined) tenant.domain = domain.trim();
  if (industry !== undefined) tenant.industry = industry.trim();
  if (monthlyRetainer !== undefined && !isNaN(Number(monthlyRetainer))) {
    const diff = Number(monthlyRetainer) - tenant.monthlyRetainer;
    tenant.monthlyRetainer = Number(monthlyRetainer);
    platformState.masterAgency.mrr += diff;
  }

  res.json({
    message: 'White-label branding updated successfully',
    tenant,
    masterAgency: platformState.masterAgency
  });
});

// 5. Create & Deploy a new AI Voice Call Agent or Website Chatbot for a tenant
app.post('/api/tenants/:tenantId/agents', (req, res) => {
  const { tenantId } = req.params;
  const { name, type, voiceId, phoneNumber, greeting, systemPrompt } = req.body;

  const tenant = platformState.tenants.find(t => t.id === tenantId);
  if (!tenant) {
    return res.status(404).json({ error: 'Client tenant not found' });
  }

  if (!name || !systemPrompt) {
    return res.status(400).json({ error: 'Agent name and system prompt are required' });
  }

  const normalizedType = type === 'chatbot' ? 'chatbot' : 'voice';

  const newAgent = {
    id: `agent-${Date.now()}`,
    name: name.trim(),
    type: normalizedType,
    voiceId: normalizedType === 'voice' ? (voiceId || 'ElevenLabs - Rachel (Warm & Professional)') : 'N/A (Web Chat Widget)',
    phoneNumber: phoneNumber ? phoneNumber.trim() : (normalizedType === 'voice' ? '+1 (888) 555-0199' : `Embedded on ${tenant.domain}`),
    greeting: greeting && greeting.trim()
      ? greeting.trim()
      : `Hello! Thank you for reaching out to ${tenant.brandName}. I am ${name.trim()}, how can I assist you today?`,
    systemPrompt: systemPrompt.trim(),
    status: 'Deployed',
    interactions: 1,
    avgLatencyMs: normalizedType === 'voice' ? 395 : 230,
    createdAt: new Date().toISOString().split('T')[0]
  };

  tenant.agents.unshift(newAgent);

  res.status(201).json({
    message: `${normalizedType === 'voice' ? 'AI Voice Call Agent' : 'AI Website Chatbot'} deployed successfully`,
    agent: newAgent,
    tenant
  });
});

// 6. Delete an agent from a tenant
app.delete('/api/tenants/:tenantId/agents/:agentId', (req, res) => {
  const { tenantId, agentId } = req.params;
  const tenant = platformState.tenants.find(t => t.id === tenantId);
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  tenant.agents = tenant.agents.filter(a => a.id !== agentId);
  res.json({
    message: 'Agent removed',
    tenant
  });
});

// 7. Live Interactive Webhook Simulator (handles both Voice Call turns & Website Chat messages)
app.post('/api/simulate/webhook', (req, res) => {
  const { tenantId, agentId, userMessage, mode, callHistory } = req.body;

  const tenant = platformState.tenants.find(t => t.id === tenantId) || platformState.tenants[0];
  const agent = tenant.agents.find(a => a.id === agentId) || tenant.agents[0];

  if (!agent) {
    return res.status(404).json({ error: 'No active AI agent found to simulate' });
  }

  // Update live telemetry counters
  agent.interactions = (agent.interactions || 0) + 1;
  if (agent.type === 'voice' || mode === 'voice') {
    platformState.masterAgency.activeCallsToday += 1;
  } else {
    platformState.masterAgency.messagesHandled += 1;
  }

  const responsePayload = generateIntelligentAgentResponse(tenant, agent, userMessage || '', callHistory || []);

  res.json({
    webhookEventId: `evt_${Date.now()}`,
    timestamp: new Date().toISOString(),
    tenantBrand: tenant.brandName,
    agentId: agent.id,
    agentName: agent.name,
    agentType: agent.type,
    voiceId: agent.voiceId,
    phoneNumber: agent.phoneNumber,
    reply: responsePayload.reply,
    intentDetected: responsePayload.intent,
    confidence: responsePayload.confidence,
    latencyMs: responsePayload.latencyMs,
    suggestedActions: responsePayload.suggestedActions,
    webhookPayloadInspector: {
      provider: agent.type === 'voice' ? 'FJ-Tech Voice Engine (Twilio + ElevenLabs + LLM)' : 'FJ-Tech Omnichannel Chat Webhook',
      tenant_id: tenant.id,
      agent_id: agent.id,
      model: 'fj-tech-realtime-4o',
      intent: responsePayload.intent,
      extracted_entities: responsePayload.entities,
      tool_triggered: responsePayload.toolTriggered
    },
    updatedStats: {
      agentInteractions: agent.interactions,
      activeCallsToday: platformState.masterAgency.activeCallsToday,
      messagesHandled: platformState.masterAgency.messagesHandled
    }
  });
});

/**
 * Generates context-aware responses grounded in the agent's custom systemPrompt,
 * tenant brand name, and user query so live testing feels authentic and responsive.
 */
function generateIntelligentAgentResponse(tenant, agent, userMessage, history) {
  const msg = userMessage.toLowerCase().trim();
  const prompt = agent.systemPrompt || '';
  const latencyMs = agent.type === 'voice'
    ? Math.floor(340 + Math.random() * 140)
    : Math.floor(190 + Math.random() * 110);

  const priceMatches = prompt.match(/\$[0-9,]+(\.[0-9]{2})?/g) || [];
  const promptSentences = prompt
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  let intent = 'general_inquiry';
  let toolTriggered = 'knowledge_base_rag';
  let entities = { brand: tenant.brandName };
  let reply = '';
  let suggestedActions = ['Book Appointment', 'Ask About Pricing', 'Request Human Transfer'];

  if (/price|cost|how much|quote|rate|fee|budget|dollar|insurance|bill/.test(msg)) {
    intent = 'pricing_and_packages';
    toolTriggered = 'pricing_lookup_tool';
    const pricingSentences = promptSentences.filter(s => /\$|cost|price|fee|insurance|budget|credit|free/i.test(s));

    if (pricingSentences.length > 0) {
      reply = `Great question! At ${tenant.brandName}, here are our current details: ${pricingSentences.join(' ')} Would you like me to lock in a consultation or send a personalized quote for you?`;
    } else if (priceMatches.length > 0) {
      reply = `At ${tenant.brandName}, our standard options start around ${priceMatches.join(' to ')}. I can put together an exact estimate based on your needs—what specific service are you looking for today?`;
    } else {
      reply = `We offer tailored options at ${tenant.brandName} depending on your exact needs. Based on my guidelines (${prompt.slice(0, 140)}...), I can schedule a quick 10-minute assessment to give you an exact quote. Does morning or afternoon work better for you?`;
    }
    suggestedActions = ['Book Free Assessment', 'Do you take insurance / financing?', 'Schedule for Tomorrow at 10 AM'];
  }
  else if (/book|schedule|appointment|visit|showing|consult|tomorrow|today|time|slot|available|calendar/.test(msg)) {
    intent = 'appointment_booking';
    toolTriggered = 'calendar_crm_booking_webhook';
    entities.booking_status = 'slot_offered';

    const hasTimeInMsg = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|[0-9]{1,2}\s?(am|pm))\b/i.exec(userMessage);
    if (hasTimeInMsg) {
      entities.requested_slot = hasTimeInMsg[0];
      reply = `I have checked the live calendar for ${tenant.brandName} and confirmed availability for ${hasTimeInMsg[0]}! I've reserved that slot for you. May I please get your full name and best phone number or email to send your calendar confirmation?`;
      suggestedActions = ['My name is Alex Rivera, 555-0148', 'Can we do 2 hours later instead?', 'What should I bring?'];
    } else {
      reply = `I'd be happy to get that scheduled for you with ${tenant.brandName}! I have open priority slots tomorrow at 10:30 AM and 2:00 PM, or Thursday at 11:00 AM. Which of those times works best for you, and what is your full name?`;
      suggestedActions = ['Tomorrow at 10:30 AM works', 'Thursday at 11:00 AM please', 'Do you have weekend hours?'];
    }
  }
  else if (/\b\d{3}[-.\s]?\d{4}\b|@|my name is|i am [a-z]+/i.test(msg)) {
    intent = 'lead_capture_confirmed';
    toolTriggered = 'crm_lead_sync_webhook';
    entities.lead_captured = true;
    reply = `Perfect, thank you! I have logged your details directly into ${tenant.brandName}'s CRM and dispatched an instant SMS & email confirmation via our automated workflow. Is there anything else I can help you with before we wrap up?`;
    suggestedActions = ['What is your address / location?', 'Ask about pricing', 'That is all, thank you!'];
  }
  else if (/emergency|urgent|human|manager|person|agent|representative|pain|broken|leak/.test(msg)) {
    intent = 'priority_escalation';
    toolTriggered = 'live_warm_transfer_bridge';
    entities.priority = 'HIGH';
    const emergencySentence = promptSentences.find(s => /emergency|urgent|dispatch|24\/7|same-day/i.test(s));
    reply = `I understand this is urgent and I'm prioritizing your request with ${tenant.brandName} right now. ${emergencySentence || 'Our on-call specialist team is available for immediate escalation.'} I am initiating a warm transfer and flagging your file as High Priority—can you confirm the best callback number in case we get disconnected?`;
    suggestedActions = ['Callback: 555-8392', 'Book Emergency Slot Now', 'How fast can someone arrive?'];
  }
  else if (/hour|open|close|location|where|address|weekend|saturday|sunday/.test(msg)) {
    intent = 'hours_and_location';
    toolTriggered = 'business_profile_lookup';
    const hoursSentence = promptSentences.find(s => /mon|tue|wed|thu|fri|sat|sun|am|pm|open|hour|miami|dubai/i.test(s));
    reply = `${hoursSentence ? hoursSentence : `At ${tenant.brandName}, our AI concierge is available 24/7, and our main office operates Monday through Saturday from 8:00 AM to 6:00 PM.`} Would you like me to reserve a time for you to come in?`;
    suggestedActions = ['Book an Appointment', 'What services do you offer?', 'Ask about pricing'];
  }
  else {
    const words = msg.split(/\W+/).filter(w => w.length > 3 && !['what', 'have', 'that', 'this', 'with', 'from', 'your', 'about', 'tell', 'more'].includes(w));
    const matchedSentences = promptSentences.filter(sentence =>
      words.some(w => sentence.toLowerCase().includes(w))
    );

    if (matchedSentences.length > 0) {
      intent = 'knowledge_matched_response';
      reply = `Here is what I can share for ${tenant.brandName}: ${matchedSentences.join(' ')} How can I help you take the next step today?`;
    } else {
      intent = 'concierge_discovery';
      const summary = promptSentences.slice(0, 2).join(' ');
      reply = `Thanks for reaching out to ${tenant.brandName}! As ${agent.name.split('-')[0].trim()}, I'm here to help right away. ${summary} Would you like to check our current availability, get a quick price estimate, or ask a specific question?`;
    }
  }

  return {
    reply,
    intent,
    confidence: Number((0.94 + Math.random() * 0.05).toFixed(2)),
    latencyMs,
    entities,
    toolTriggered,
    suggestedActions
  };
}

// Serve frontend/index.html for root and unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n==================================================================`);
    console.log(`🚀 FJ-Tech Solutions White-Label AI Platform is LIVE!`);
    console.log(`📂 Backend API Directory : ${__dirname}`);
    console.log(`🎨 Frontend UI Directory : ${FRONTEND_DIR}`);
    console.log(`🌐 Local Dashboard URL   : http://localhost:${PORT}`);
    console.log(`==================================================================\n`);
  });
}

module.exports = app;


