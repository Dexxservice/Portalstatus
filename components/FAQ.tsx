import React from 'react';

type FAQItem = { q: string; a: React.ReactNode };

const faqs: FAQItem[] = [
  // 1) General process & timeline
  {
    q: 'How long does the whole process take?',
    a: (
      <>
        The processing time depends on your current step. Your dashboard shows an
        estimated wait time for each stage and the expected completion date.
      </>
    ),
  },
  {
    q: 'What are the main steps?',
    a: (
      <ol style={{ paddingLeft: 18, margin: 0 }}>
        <li>Document submission</li>
        <li>Internal completeness check</li>
        <li>Submission to the German Embassy</li>
        <li>Embassy review and approval</li>
        <li>Appointment scheduling</li>
        <li>Visa issuance / passport return</li>
      </ol>
    ),
  },

  // 2) Documents & requirements
  {
    q: 'Which documents are required?',
    a: (
      <>
        You will receive the checklist and the official Google Form link via WhatsApp.
        Commonly required: passport, application form, proof of qualifications, and any
        additional documents listed in the checklist.
      </>
    ),
  },
  {
    q: 'How do I upload additional or missing documents?',
    a: (
      <>
        Use the “Documents” section in your dashboard. If your status shows{' '}
        <b>Missing Documents</b>, you will see an upload button there.
      </>
    ),
  },

  // 3) Embassy-related
  {
    q: 'Does the embassy work on weekends?',
    a: (
      <>
        No. The embassy operates Monday to Friday only. Weekends are not counted in
        the estimated processing times.
      </>
    ),
  },
  {
    q: 'Can I choose my appointment date?',
    a: (
      <>
        Appointment slots are limited. As soon as a slot can be booked, the Dexx Office
        Team will arrange one for you. Only a certain number of slots are released by
        the embassy, so flexibility is very limited.
      </>
    ),
  },

  // 4) Job opportunities
  {
    q: 'What kind of jobs can I work in through Dexx?',
    a: (
      <>
        <b>Warehouse & logistics:</b> picking, packing, warehouse assistant, inventory/stocktaking,
        shipping & receiving, returns processing, sorting/scanning, loading/unloading, QC inspector,
        forklift / reach-truck operator (with certificate).<br />
        <b>Production & manufacturing:</b> production/assembly line, entry-level machine operator,
        packaging operator, QA assistant, maintenance helper (non-licensed).<br />
        <b>Related support (if available):</b> logistics coordinator (entry), driver assistant,
        logistics office support (data entry / scheduling).
      </>
    ),
  },

  // 5) Uploading (general, visa-independent)
  {
    q: 'How do I submit my documents?',
    a: (
      <>
        You will receive an official Google Form link via WhatsApp. Use it to upload all
        required documents. You can pause anytime and continue later — your progress is saved
        automatically. We review within <b>1–3 working days</b>. If anything is missing or
        incorrect, we will contact you. <b>Only complete and correct submissions move forward
        to embassy appointment scheduling.</b>
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <section aria-labelledby="faq-title" style={{ margin: '24px auto', maxWidth: 720 }}>
      <h2 id="faq-title" style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>
        Frequently Asked Questions
      </h2>

      <div style={{ display: 'grid', gap: 8 }}>
        {faqs.map((item, i) => (
          <details
            key={i}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 12,
              background: '#fff',
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                listStyle: 'none',
                cursor: 'pointer',
                padding: '12px 14px',
                fontWeight: 600,
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {item.q}
            </summary>
            <div style={{ padding: '0 14px 12px 14px', color: '#333', lineHeight: 1.5 }}>
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
