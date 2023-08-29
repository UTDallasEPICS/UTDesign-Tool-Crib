import Dashboard from '@/app/Components/Dashboard'
import Header from './Components/Header';
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export const title = "Dashboard";

export default withPageAuthRequired( async function Home() {
  return (
      <main>
        <Header title="Dashboard"/>
        <Dashboard />
      </main>
  )
}, {returnTo: '/'});
