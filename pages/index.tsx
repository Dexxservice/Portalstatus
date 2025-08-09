import { StatusCard } from '@/components/StatusCard';
import { useEffect, useState } from 'react';

export default function Home() {
  // Platzhalter: Hier würdest du den echten Bewerber-Status aus Supabase laden.
  // Wir zeigen vorerst eine Demo:
  const [code, setCode] = useState<'DOCS_RECEIVED'|'INTERNAL_REVIEW_DONE'|'SUBMITTED_TO_EMBASSY'|'EMBASSY_APPROVED'|'APPOINTMENT_SCHEDULED'|'COMPLETED'>('DOCS_RECEIVED');

  useEffect(()=>{
    // TODO: Supabase-Query nach login
  },[]);

  return (
    <div style={{display:'grid',gap:16}}>
      <h1>Ihr Visa-Status</h1>
      <StatusCard code={code} />
    </div>
  );
}
