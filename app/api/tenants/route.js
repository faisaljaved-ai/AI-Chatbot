import { NextResponse } from 'next/server';
import { getPlatformState } from '../../../lib/platformStore';

export async function POST(request) {
  const platformState = getPlatformState();
  const { brandName, industry, domain, logoUrl, primaryColor, accentColor, monthlyRetainer } =
    await request.json();

  if (!brandName || !brandName.trim()) {
    return NextResponse.json({ error: 'Client brand name is required' }, { status: 400 });
  }

  const newTenant = {
    id: `tenant-${Date.now()}`,
    brandName: brandName.trim(),
    industry: industry || 'Commercial Enterprise',
    domain: domain || `ai.${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    logoUrl:
      logoUrl ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    primaryColor: primaryColor || '#635BFF',
    accentColor: accentColor || '#21C8D8',
    monthlyRetainer: Number(monthlyRetainer) || 1500,
    status: 'Active',
    agents: []
  };

  platformState.tenants.push(newTenant);
  platformState.activeTenantId = newTenant.id;
  platformState.masterAgency.mrr += newTenant.monthlyRetainer;

  return NextResponse.json(
    {
      message: 'New white-label client tenant created',
      activeTenant: newTenant,
      tenants: platformState.tenants,
      masterAgency: platformState.masterAgency
    },
    { status: 201 }
  );
}

