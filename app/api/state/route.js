import { NextResponse } from 'next/server';
import { getPlatformState } from '../../../lib/platformStore';

export async function GET() {
  const platformState = getPlatformState();
  const activeTenant =
    platformState.tenants.find((t) => t.id === platformState.activeTenantId) ||
    platformState.tenants[0];

  return NextResponse.json({
    masterAgency: platformState.masterAgency,
    activeTenantId: activeTenant.id,
    activeTenant,
    tenants: platformState.tenants
  });
}

