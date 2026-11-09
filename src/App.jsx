import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Product from './pages/Product.jsx';
import Collections from './pages/Collections.jsx';
import TrackOrder from './pages/TrackOrder.jsx';
import Looks from './pages/Looks.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Customise from './pages/Customise.jsx';
import Journal from './pages/Journal.jsx';
import JournalDetail from './pages/JournalDetail.jsx';
import About from './pages/About.jsx';
import Account from './pages/Account.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import NotFound from './pages/NotFound.jsx';
import CatalogGate from './components/CatalogGate.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Admin from './pages/admin/Admin.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

export default function App() {
  return (
    <div className="site">
      <ScrollToTop />
      <Header />
      <main>
        <CatalogGate>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/looks" element={<Looks />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/customise" element={<Customise />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:id" element={<JournalDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/account" element={<Account />} />
            <Route path="/order/:id" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </CatalogGate>
      </main>
      <Footer />
    </div>
  );
}
