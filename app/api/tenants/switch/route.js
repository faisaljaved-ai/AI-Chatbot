import { NextResponse } from 'next/server';
import { getPlatformState } from '../../../../lib/platformStore';

export async function POST(request) {
  const platformState = getPlatformState();
  const { tenantId } = await request.json();
  const found = platformState.tenants.find((t) => t.id === tenantId);

  if (!found) {
    return NextResponse.json({ error: 'Client workspace not found' }, { status: 404 });
  }

  platformState.activeTenantId = found.id;
  return NextResponse.json({
    message: `Switched workspace to ${found.brandName}`,
    activeTenant: found
  });
}

