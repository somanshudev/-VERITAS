import '../styles/globals.css';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  // Determine current page from route
  const getCurrentPage = () => {
    const path = router.pathname;
    if (path === '/') return 'home';
    if (path === '/operator') return 'operator';
    if (path === '/qa') return 'qa';
    if (path === '/admin') return 'admin';
    if (path === '/manufacturer') return 'manufacturer';
    if (path === '/reports') return 'reports';
    if (path === '/learning') return 'learning';
    return 'home';
  };

  // Render admin pages without the global Layout to prevent double navbars
  const isAdminRoute = router.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout currentPage={getCurrentPage()}>
      <Component {...pageProps} />
    </Layout>
  );
}
