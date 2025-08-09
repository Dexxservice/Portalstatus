import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabaseService';
import { z } from 'zod';

const Body = z.object({
  digital_diplo_status: z.string().optional(),
  twofa_email_status: z.string().optional(),
  health_insurance: z.string().optional(),
  work_checks: z.number().int().min(0).max(6).optional(),
  internal_notes: z.string().max(5000).optional(),
  quick_note: z.string().optional(),
  soft_delete: z.boolean().optional(),
  restore: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // NOTE: Keep your real auth here; placeholder guard:
  const role = req.headers.get('x-role');
  if (role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const patch: Record<string, any> = { updated_at: new Date().toISOString() };
  if (data.digital_diplo_status) patch.digital_diplo_status = data.digital_diplo_status;
  if (data.twofa_email_status) patch.twofa_email_status = data.twofa_email_status;
  if (data.health_insurance) patch.health_insurance = data.health_insurance;
  if (typeof data.work_checks === 'number') patch.work_checks = data.work_checks;
  if (typeof data.internal_notes === 'string') patch.internal_notes = data.internal_notes;

  if (data.soft_delete) patch.deleted_at = new Date().toISOString();
  if (data.restore) patch.deleted_at = null;

  if (data.quick_note && data.quick_note.trim().length > 0) {
    const { data: existing, error: e0 } = await supabaseService
      .from('cases')
      .select('quick_notes')
      .eq('id', params.id)
      .single();
    if (e0) return NextResponse.json({ error: e0.message }, { status: 500 });
    const arr = Array.isArray(existing?.quick_notes) ? existing.quick_notes : [];
    arr.push({ text: data.quick_note, at: new Date().toISOString() });
    patch.quick_notes = arr;
  }

  const { error } = await supabaseService.from('cases').update(patch).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
