import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { StatusCard } from '../components/StatusCard';
import FAQ from '../components/FAQ';
import type { StatusCode } from '../lib/statusCatalog';

type CaseRow = {
  id: string;
  applicant_email: string;
  status: string;
  updated_at: string;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<StatusCode>('DOCS_RECEIVED');
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    cons
