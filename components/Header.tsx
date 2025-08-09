import Image from 'next/image';

export default function Header() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderBottom: '1px solid #eee',
      position: 'sticky',
      top: 0,
      background: '#fff',
      zIndex: 10
    }}>
      <Image src="/branding/logo.png" alt="Dexx Visa Service" width={140} height={40} priority />
      <div style={{fontWeight: 600}}>{process.env.NEXT_PUBLIC_APP_NAME ?? 'Dexx Visa Service GmbH'}</div>
    </header>
  );
}
