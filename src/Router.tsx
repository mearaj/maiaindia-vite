import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProfilePage from '@/pages/Profile';
import CancellationRefundPolicy from '@/pages/CancellationRefundPolicy';
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
import TermsConditionsPage from '@/pages/TermsConditions';
import PrivacyPolicyPage from '@/pages/PrivacyPolicy';
import AdminProductsPage from '@/pages/Admin/Products';
import AdminProductDetailsPage from '@/pages/Admin/AdminProductDetails';
// Abs implies absolute

const homeAbs = '/products';
const homeRelative = 'products';
const adminHomeAbs = '/admin/products';
const adminHomeRelative = 'products';

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
  cancellationRefundPolicies: '/cancellationRefundPolicy',
  aboutUs: '/aboutUs',
  liveChat: '/liveChat',
  adminHomeAbs,
  adminProducts: '/admin/products',
  adminProductDetails: '/admin/products/:id',
  adminOrders: '/admin/orders',
  adminProductsAdd: '/admin/products/add',
  profile: '/profile',
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
  cancellationRefundPolicy: 'cancellationRefundPolicy',
  liveChat: 'liveChat',
  adminHomeRelative, // relative to admin
  adminProducts: 'products', // relative to admin
  profile: 'profile',
  adminHome: 'home', // relative to admin
  adminOrders: 'orders', // relative to admin
  adminProductsAdd: 'products/add', // relative to admin,
  adminProductDetails: 'products/:id', // relative to admin,
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
        path: appRelativeRoutes.cancellationRefundPolicy,
        element: <CancellationRefundPolicy />,
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
        path: appRelativeRoutes.privacyPolicy,
        element: <PrivacyPolicyPage />,
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
            path: appRelativeRoutes.profile,
            element: <ProfilePage />,
          },
          {
            path: appRelativeRoutes.admin,
            children: [
              {
                path: appRelativeRoutes.root,
                element: <Navigate to={appAbsoluteRoutes.adminHomeAbs} />,
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
              {
                path: appRelativeRoutes.adminProducts,
                element: <AdminProductsPage />,
              },
              {
                path: appRelativeRoutes.adminProductDetails,
                element: <AdminProductDetailsPage />,
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
