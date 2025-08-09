// /app/api/admin/cases/[id]/metadata/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabaseService';

type Body = {
  digital_diplo_status?: string;
  twofa_email_status?: string;
  health_insurance?: string;
  work_checks?: number | string;
  internal_notes?: string;
  quick_note?: string;
  soft_delete?: boolean;
  restore?: boolean;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function toIntInRange(v: unknown, min: number, max: number) {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  if (Math.floor(n) !== n) return null;
  if (n < min || n > max) return null;
  return n;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // Keep your real auth middleware; this header check is only minimal
  const role = req.headers.get('x-role');
  if (role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const patch: Record<string, any> = { updated_at: new Date().toISOString() };

  if (isNonEmptyString(body.digital_diplo_status)) patch.digital_diplo_status = body.digital_diplo_status;
  if (isNonEmptyString(body.twofa_email_status))   patch.twofa_email_status   = body.twofa_email_status;
  if (isNonEmptyString(body.health_insurance))     patch.health_insurance     = body.health_insurance;
  if (isNonEmptyString(body.internal_notes))       patch.internal_notes       = body.internal_notes;

  const wc = toIntInRange(body.work_checks, 0, 6);
  if (wc !== null) patch.work_checks = wc;

  if (body.soft_delete) patch.deleted_at = new Date().toISOString();
  if (body.restore)     patch.deleted_at = null;

  if (isNonEmptyString(body.quick_note)) {
    const { data: existing, error: e0 } = await supabaseService
      .from('cases')
      .select('quick_notes')
      .eq('id', params.id)
      .single();
    if (e0) return NextResponse.json({ error: e0.message }, { status: 500 });

    const arr = Array.isArray(existing?.quick_notes) ? existing.quick_notes : [];
    arr.push({ text: body.quick_note, at: new Date().toISOString() });
    patch.quick_notes = arr;
  }

  const { error } = await supabaseService.from('cases').update(patch).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
