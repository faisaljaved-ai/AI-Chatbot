import { NextResponse } from 'next/server';
import { getPlatformState } from '../../../../../lib/platformStore';

export async function POST(request, { params }) {
  const platformState = getPlatformState();
  const { tenantId } = await params;
  const { name, type, voiceId, phoneNumber, greeting, systemPrompt } = await request.json();

  const tenant = platformState.tenants.find((t) => t.id === tenantId);
  if (!tenant) {
    return NextResponse.json({ error: 'Client tenant not found' }, { status: 404 });
  }

  if (!name || !systemPrompt) {
    return NextResponse.json(
      { error: 'Agent name and system prompt are required' },
      { status: 400 }
    );
  }

  const normalizedType = type === 'chatbot' ? 'chatbot' : 'voice';

  const newAgent = {
    id: `agent-${Date.now()}`,
    name: name.trim(),
    type: normalizedType,
    voiceId:
      normalizedType === 'voice'
        ? voiceId || 'ElevenLabs - Rachel (Warm & Professional)'
        : 'N/A (Web Chat Widget)',
    phoneNumber: phoneNumber
      ? phoneNumber.trim()
      : normalizedType === 'voice'
      ? '+1 (888) 555-0199'
      : `Embedded on ${tenant.domain}`,
    greeting:
      greeting && greeting.trim()
        ? greeting.trim()
        : `Hello! Thank you for reaching out to ${tenant.brandName}. I am ${name.trim()}, how can I assist you today?`,
    systemPrompt: systemPrompt.trim(),
    status: 'Deployed',
    interactions: 1,
    avgLatencyMs: normalizedType === 'voice' ? 395 : 230,
    createdAt: new Date().toISOString().split('T')[0]
  };

  tenant.agents.unshift(newAgent);

  return NextResponse.json(
    {
      message: `${
        normalizedType === 'voice' ? 'AI Voice Call Agent' : 'AI Website Chatbot'
      } deployed successfully`,
      agent: newAgent,
      tenant
    },
    { status: 201 }
  );
}

