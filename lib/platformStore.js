import { NextResponse } from 'next/server';

// Shared multi-tenant state for Next.js API routes (preserves exact schema & seed data)
const globalForState = globalThis;

if (!globalForState.__FJ_PLATFORM_STATE__) {
  globalForState.__FJ_PLATFORM_STATE__ = {
    masterAgency: {
      name: 'FJ-Tech Solutions',
      tagline: 'Enterprise White-Label AI Voice & Chatbot Infrastructure',
      mrr: 14850,
      activeCallsToday: 1284,
      messagesHandled: 48920
    },
    activeTenantId: 'tenant-apex',
    tenants: [
      {
        id: 'tenant-apex',
        brandName: 'Apex Dental & Implant Studio',
        industry: 'Healthcare / Dental',
        domain: 'ai.apexdentalstudio.com',
        logoUrl:
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=120&auto=format&fit=crop&q=80',
        primaryColor: '#635BFF',
        accentColor: '#21C8D8',
        monthlyRetainer: 1500,
        status: 'Active',
        agents: [
          {
            id: 'agent-101',
            name: 'Sophia - 24/7 Patient Receptionist',
            type: 'voice',
            voiceId: 'ElevenLabs - Rachel (Warm & Professional)',
            phoneNumber: '+1 (888) 412-9040',
            greeting:
              'Thank you for calling Apex Dental Studio! This is Sophia, your AI care coordinator. How can I help you with your smile today?',
            systemPrompt:
              "You are Sophia, the senior AI voice receptionist at Apex Dental & Implant Studio. You book teeth cleanings, emergency root canals, and cosmetic implant consultations. Dental cleanings cost $125 without insurance. We accept Delta Dental, Cigna, and Aetna. Open Mon-Sat 8am to 6pm. Always ask for the patient's full name and preferred time slot.",
            status: 'Deployed',
            interactions: 642,
            avgLatencyMs: 410,
            createdAt: '2026-10-12'
          },
          {
            id: 'agent-102',
            name: 'Apex Web Concierge & Insurance Verifier',
            type: 'chatbot',
            voiceId: 'N/A (Web Widget)',
            phoneNumber: 'Embedded on apexdentalstudio.com',
            greeting:
              'Hi there! Welcome to Apex Dental Studio. Need an instant quote on veneers, Invisalign, or an emergency appointment?',
            systemPrompt:
              'You are the website AI chat assistant for Apex Dental Studio. Answer questions concisely about Invisalign ($3,900 all-inclusive), Zoom Whitening ($299), and same-day emergency appointments. Offer to schedule a free 15-minute smile consultation.',
            status: 'Deployed',
            interactions: 1840,
            avgLatencyMs: 280,
            createdAt: '2026-10-15'
          }
        ]
      },
      {
        id: 'tenant-vanguard',
        brandName: 'Vanguard Luxury Realty Group',
        industry: 'Real Estate',
        domain: 'concierge.vanguardluxury.io',
        logoUrl:
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=80',
        primaryColor: '#10b981',
        accentColor: '#f59e0b',
        monthlyRetainer: 2200,
        status: 'Active',
        agents: [
          {
            id: 'agent-201',
            name: 'Marcus - Inbound Lead Qualifier',
            type: 'voice',
            voiceId: 'Deepgram Aura - Orion (Executive Male)',
            phoneNumber: '+1 (305) 990-8122',
            greeting:
              "Hello, you've reached Vanguard Luxury Realty. I'm Marcus, our automated property specialist. Are you looking to buy, sell, or schedule a private penthouse viewing?",
            systemPrompt:
              'You are Marcus, an executive real estate AI voice agent for Vanguard Luxury Realty in Miami & Dubai. Qualify buyers by asking for their budget range ($1M-$25M+), preferred neighborhood (Brickell, Star Island, Palm Jumeirah), and timeline. Offer to book a VIP showing with a senior broker.',
            status: 'Deployed',
            interactions: 389,
            avgLatencyMs: 390,
            createdAt: '2026-10-18'
          },
          {
            id: 'agent-202',
            name: '24/7 MLS Property Finder Bot',
            type: 'chatbot',
            voiceId: 'N/A (Omnichannel Chat)',
            phoneNumber: 'WhatsApp & Web Widget',
            greeting:
              "Welcome to Vanguard Luxury Realty! Tell me how many bedrooms and which waterfront area you're exploring, and I'll send you off-market listings.",
            systemPrompt:
              "You are Vanguard Luxury Realty's instant property concierge. Share featured listings like The Residences at Brickell ($3.4M, 4BD/4.5BA private elevator) and Coral Gables Waterfront Villa ($6.8M, private dock). Collect the prospect's email or WhatsApp number to send PDF brochures.",
            status: 'Deployed',
            interactions: 2190,
            avgLatencyMs: 245,
            createdAt: '2026-10-20'
          }
        ]
      },
      {
        id: 'tenant-solaris',
        brandName: 'Solaris Home Energy & HVAC',
        industry: 'Home Services & Solar',
        domain: 'portal.solarishome.energy',
        logoUrl:
          'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=120&auto=format&fit=crop&q=80',
        primaryColor: '#f97316',
        accentColor: '#eab308',
        monthlyRetainer: 1850,
        status: 'Active',
        agents: [
          {
            id: 'agent-301',
            name: 'Elena - Solar Rebate & Dispatch Caller',
            type: 'voice',
            voiceId: 'OpenAI Realtime - Nova (Energetic)',
            phoneNumber: '+1 (800) 755-2390',
            greeting:
              "Hi! Thanks for calling Solaris Home Energy. I'm Elena! Are you calling about our 24/7 emergency HVAC repair or the 30% Federal Solar Tax Credit assessment?",
            systemPrompt:
              "You are Elena from Solaris Home Energy. You dispatch emergency AC/heating technicians within 2 hours ($89 diagnostic fee waived with repair) and qualify homeowners for $0-down solar panel installations. Ask for the homeowner's average monthly electric bill and roof age.",
            status: 'Deployed',
            interactions: 915,
            avgLatencyMs: 425,
            createdAt: '2026-10-24'
          }
        ]
      }
    ]
  };
}

export function getPlatformState() {
  return globalForState.__FJ_PLATFORM_STATE__;
}

