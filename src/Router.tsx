import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '@/App';
import ProductsPage from '@/pages/Products';
import ProductDetailsPage from '@/pages/ProductDetails';
import LiveChatPage from '@/pages/LiveChat';
import ContactUsPage from '@/pages/ContactUs';
import CartPage from '@/pages/Cart';
import { AdminHomePage } from '@/pages/Admin';
import AdminOrdersPage from '@/pages/Admin/Orders';
import AdminAddProductPage from '@/pages/Admin/AddProduct';
import AuthRoutes from '@/Auth';
import AboutUsPage from '@/pages/AboutUs';
import CancellationRefundPolicies from '@/pages/CancellationRefundPolicies';
import TermsConditionsPage from '@/pages/TermsConditions';
// Abs implies absolute

const homeAbs = '/products';
const homeRelative = 'products';

export const appAbsoluteRoutes = {
  root: '/',
  home: homeAbs,
  products: '/products',
  productDetails: '/products/:id',
  cart: '/cart',
  admin: '/admin',
  contactUs: '/contactUs',
  privacyPolicy: '/privacyPolicy',
  termsConditions: '/termsConditions',
  cancellationRefundPolicies: '/cancellationRefundPolicies',
  aboutUs: '/aboutUs',
  liveChat: '/liveChat',
  adminHome: '/admin/home',
  adminOrders: '/admin/orders',
  adminProductsAdd: '/admin/products/add',
};

export const appRelativeRoutes = {
  root: '',
  home: homeRelative,
  products: 'products',
  productDetails: 'products/:id',
  cart: 'cart',
  admin: 'admin',
  contactUs: 'contactUs',
  aboutUs: 'aboutUs',
  privacyPolicy: 'privacyPolicy',
  termsConditions: 'termsConditions',
  cancellationRefundPolicies: 'cancellationRefundPolicies',
  liveChat: 'liveChat',
  adminHome: 'home', // relative to admin
  adminOrders: 'orders', // relative to admin
  adminProductsAdd: 'products/add', // relative to admin,
};

export const router = createBrowserRouter([
  {
    path: appAbsoluteRoutes.root,
    element: <App />,
    children: [
      {
        path: appRelativeRoutes.root,
        element: <Navigate to={appAbsoluteRoutes.products} />,
      },
      {
        path: appRelativeRoutes.products,
        element: <ProductsPage />,
      },
      {
        path: '/home',
        element: <Navigate to={appAbsoluteRoutes.products} />,
      },
      {
        path: appRelativeRoutes.productDetails,
        element: <ProductDetailsPage />,
      },
      {
        path: appRelativeRoutes.contactUs,
        element: <ContactUsPage />,
      },
      {
        path: appRelativeRoutes.cancellationRefundPolicies,
        element: <CancellationRefundPolicies />,
      },
      {
        path: appRelativeRoutes.aboutUs,
        element: <AboutUsPage />,
      },
      {
        path: appRelativeRoutes.termsConditions,
        element: <TermsConditionsPage />,
      },
      {
        path: '',
        element: <AuthRoutes />,
        children: [
          {
            path: appRelativeRoutes.liveChat,
            element: <LiveChatPage />,
          },
          {
            path: appRelativeRoutes.cart,
            element: <CartPage />,
          },
          {
            path: appRelativeRoutes.admin,
            children: [
              {
                path: appRelativeRoutes.root,
                element: <Navigate to={appAbsoluteRoutes.adminHome} />,
              },
              {
                path: appRelativeRoutes.adminHome,
                element: <AdminHomePage />,
              },
              {
                path: appRelativeRoutes.adminOrders,
                element: <AdminOrdersPage />,
              },
              {
                path: appRelativeRoutes.adminProductsAdd,
                element: <AdminAddProductPage />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to={appAbsoluteRoutes.products} />,
      },
    ],
  },
]);
