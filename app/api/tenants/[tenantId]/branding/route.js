import { NextResponse } from 'next/server';
import { getPlatformState } from '../../../../../lib/platformStore';

export async function PUT(request, { params }) {
  const platformState = getPlatformState();
  const { tenantId } = await params;
  const { brandName, logoUrl, primaryColor, accentColor, domain, industry, monthlyRetainer } =
    await request.json();

  const tenant = platformState.tenants.find((t) => t.id === tenantId);
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
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

  return NextResponse.json({
    message: 'White-label branding updated successfully',
    tenant,
    masterAgency: platformState.masterAgency
  });
}

