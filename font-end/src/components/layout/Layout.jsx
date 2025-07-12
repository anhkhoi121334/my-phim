import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, isAdmin = false, isContactPage = false }) => {
  // This layout component should only render Header and Footer once
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && !isContactPage && <Header />}
      <main className={isAdmin || isContactPage ? 'flex-grow' : 'flex-grow bg-white'}>
        {children}
      </main>
      {!isAdmin && !isContactPage && <Footer />}
    </div>
  );
};

export default Layout; 