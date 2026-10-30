import { NextResponse } from 'next/server';
import { getPlatformState } from '../../../../../../lib/platformStore';

export async function DELETE(_request, { params }) {
  const platformState = getPlatformState();
  const { tenantId, agentId } = await params;
  const tenant = platformState.tenants.find((t) => t.id === tenantId);

  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  tenant.agents = tenant.agents.filter((a) => a.id !== agentId);
  return NextResponse.json({
    message: 'Agent removed',
    tenant
  });
}

