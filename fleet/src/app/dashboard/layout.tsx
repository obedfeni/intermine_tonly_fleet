import { auth } from '../../lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '../../components/Sidebar'
import { Header } from '../../components/Header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
      <Sidebar user={session.user as any} />
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
        <Header user={session.user as any} />
        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  )
}
