import { NextResponse } from 'next/server';
import { getPlatformState } from '../../../../lib/platformStore';

function generateIntelligentAgentResponse(tenant, agent, userMessage) {
  const msg = (userMessage || '').toLowerCase().trim();
  const prompt = agent.systemPrompt || '';
  const latencyMs =
    agent.type === 'voice'
      ? Math.floor(340 + Math.random() * 140)
      : Math.floor(190 + Math.random() * 110);

  const priceMatches = prompt.match(/\$[0-9,]+(\.[0-9]{2})?/g) || [];
  const promptSentences = prompt
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  let intent = 'general_inquiry';
  let toolTriggered = 'knowledge_base_rag';
  let entities = { brand: tenant.brandName };
  let reply = '';
  let suggestedActions = ['Book Appointment', 'Ask About Pricing', 'Request Human Transfer'];

  if (/price|cost|how much|quote|rate|fee|budget|dollar|insurance|bill/.test(msg)) {
    intent = 'pricing_and_packages';
    toolTriggered = 'pricing_lookup_tool';
    const pricingSentences = promptSentences.filter((s) =>
      /\$|cost|price|fee|insurance|budget|credit|free/i.test(s)
    );

    if (pricingSentences.length > 0) {
      reply = `Great question! At ${tenant.brandName}, here are our current details: ${pricingSentences.join(
        ' '
      )} Would you like me to lock in a consultation or send a personalized quote for you?`;
    } else if (priceMatches.length > 0) {
      reply = `At ${tenant.brandName}, our standard options start around ${priceMatches.join(
        ' to '
      )}. I can put together an exact estimate based on your needs—what specific service are you looking for today?`;
    } else {
      reply = `We offer tailored options at ${tenant.brandName} depending on your exact needs. Based on my guidelines (${prompt.slice(
        0,
        140
      )}...), I can schedule a quick 10-minute assessment to give you an exact quote. Does morning or afternoon work better for you?`;
    }
    suggestedActions = [
      'Book Free Assessment',
      'Do you take insurance / financing?',
      'Schedule for Tomorrow at 10 AM'
    ];
  } else if (
    /book|schedule|appointment|visit|showing|consult|tomorrow|today|time|slot|available|calendar/.test(
      msg
    )
  ) {
    intent = 'appointment_booking';
    toolTriggered = 'calendar_crm_booking_webhook';
    entities.booking_status = 'slot_offered';

    const hasTimeInMsg =
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|[0-9]{1,2}\s?(am|pm))\b/i.exec(
        userMessage
      );
    if (hasTimeInMsg) {
      entities.requested_slot = hasTimeInMsg[0];
      reply = `I have checked the live calendar for ${tenant.brandName} and confirmed availability for ${hasTimeInMsg[0]}! I've reserved that slot for you. May I please get your full name and best phone number or email to send your calendar confirmation?`;
      suggestedActions = [
        'My name is Alex Rivera, 555-0148',
        'Can we do 2 hours later instead?',
        'What should I bring?'
      ];
    } else {
      reply = `I'd be happy to get that scheduled for you with ${tenant.brandName}! I have open priority slots tomorrow at 10:30 AM and 2:00 PM, or Thursday at 11:00 AM. Which of those times works best for you, and what is your full name?`;
      suggestedActions = [
        'Tomorrow at 10:30 AM works',
        'Thursday at 11:00 AM please',
        'Do you have weekend hours?'
      ];
    }
  } else if (/\b\d{3}[-.\s]?\d{4}\b|@|my name is|i am [a-z]+/i.test(msg)) {
    intent = 'lead_capture_confirmed';
    toolTriggered = 'crm_lead_sync_webhook';
    entities.lead_captured = true;
    reply = `Perfect, thank you! I have logged your details directly into ${tenant.brandName}'s CRM and dispatched an instant SMS & email confirmation via our automated workflow. Is there anything else I can help you with before we wrap up?`;
    suggestedActions = [
      'What is your address / location?',
      'Ask about pricing',
      'That is all, thank you!'
    ];
  } else if (/emergency|urgent|human|manager|person|agent|representative|pain|broken|leak/.test(msg)) {
    intent = 'priority_escalation';
    toolTriggered = 'live_warm_transfer_bridge';
    entities.priority = 'HIGH';
    const emergencySentence = promptSentences.find((s) =>
      /emergency|urgent|dispatch|24\/7|same-day/i.test(s)
    );
    reply = `I understand this is urgent and I'm prioritizing your request with ${tenant.brandName} right now. ${
      emergencySentence || 'Our on-call specialist team is available for immediate escalation.'
    } I am initiating a warm transfer and flagging your file as High Priority—can you confirm the best callback number in case we get disconnected?`;
    suggestedActions = [
      'Callback: 555-8392',
      'Book Emergency Slot Now',
      'How fast can someone arrive?'
    ];
  } else if (/hour|open|close|location|where|address|weekend|saturday|sunday/.test(msg)) {
    intent = 'hours_and_location';
    toolTriggered = 'business_profile_lookup';
    const hoursSentence = promptSentences.find((s) =>
      /mon|tue|wed|thu|fri|sat|sun|am|pm|open|hour|miami|dubai/i.test(s)
    );
    reply = `${
      hoursSentence
        ? hoursSentence
        : `At ${tenant.brandName}, our AI concierge is available 24/7, and our main office operates Monday through Saturday from 8:00 AM to 6:00 PM.`
    } Would you like me to reserve a time for you to come in?`;
    suggestedActions = ['Book an Appointment', 'What services do you offer?', 'Ask about pricing'];
  } else {
    const words = msg
      .split(/\W+/)
      .filter(
        (w) =>
          w.length > 3 &&
          !['what', 'have', 'that', 'this', 'with', 'from', 'your', 'about', 'tell', 'more'].includes(
            w
          )
      );
    const matchedSentences = promptSentences.filter((sentence) =>
      words.some((w) => sentence.toLowerCase().includes(w))
    );

    if (matchedSentences.length > 0) {
      intent = 'knowledge_matched_response';
      reply = `Here is what I can share for ${tenant.brandName}: ${matchedSentences.join(
        ' '
      )} How can I help you take the next step today?`;
    } else {
      intent = 'concierge_discovery';
      const summary = promptSentences.slice(0, 2).join(' ');
      reply = `Thanks for reaching out to ${tenant.brandName}! As ${agent.name
        .split('-')[0]
        .trim()}, I'm here to help right away. ${summary} Would you like to check our current availability, get a quick price estimate, or ask a specific question?`;
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

export async function POST(request) {
  const platformState = getPlatformState();
  const { tenantId, agentId, userMessage, mode } = await request.json();

  const tenant =
    platformState.tenants.find((t) => t.id === tenantId) || platformState.tenants[0];
  const agent = tenant.agents.find((a) => a.id === agentId) || tenant.agents[0];

  if (!agent) {
    return NextResponse.json({ error: 'No active AI agent found to simulate' }, { status: 404 });
  }

  agent.interactions = (agent.interactions || 0) + 1;
  if (agent.type === 'voice' || mode === 'voice') {
    platformState.masterAgency.activeCallsToday += 1;
  } else {
    platformState.masterAgency.messagesHandled += 1;
  }

  const responsePayload = generateIntelligentAgentResponse(tenant, agent, userMessage || '');

  return NextResponse.json({
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
      provider:
        agent.type === 'voice'
          ? 'FJ-Tech Voice Engine (Twilio + ElevenLabs + LLM)'
          : 'FJ-Tech Omnichannel Chat Webhook',
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
}

