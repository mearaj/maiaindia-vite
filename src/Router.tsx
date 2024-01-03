import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { AuthState } from '@/recoil/atoms/user';
import { Box } from '@mui/material';
import { Loader } from '@/components';
import { isAdminSelector } from '@/recoil/selectors/isAdmin';
import AdminLiveChatPage from '@/pages/Admin/LiveChat';
import ProfilePage from '@/pages/Profile';
import CancellationRefundPolicy from '@/pages/CancellationRefundPolicy';
import App from '@/App';
import ProductsPage from '@/pages/Products';
import ProductDetailsPage from '@/pages/ProductDetails';
import ContactUsPage from '@/pages/ContactUs';
import CartPage from '@/pages/Cart';
import { AdminHomePage } from '@/pages/Admin';
import AdminOrdersPage from '@/pages/Admin/Orders';
import AdminAddProductPage from '@/pages/Admin/AddProduct';
import AboutUsPage from '@/pages/AboutUs';
import TermsConditionsPage from '@/pages/TermsConditions';
import PrivacyPolicyPage from '@/pages/PrivacyPolicy';
import AdminProductsPage from '@/pages/Admin/Products';
import AdminProductDetailsPage from '@/pages/Admin/AdminProductDetails';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import SignInButton from '@/components/Buttons/SignIn';
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
  adminHomeAbs,
  adminLiveChat: '/admin/liveChat',
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
  adminHomeRelative, // relative to admin
  adminLiveChat: 'liveChat',
  adminProducts: 'products', // relative to admin
  profile: 'profile',
  adminHome: 'home', // relative to admin
  adminOrders: 'orders', // relative to admin
  adminProductsAdd: 'products/add', // relative to admin,
  adminProductDetails: 'products/:id', // relative to admin,
};

function AuthRoutes() {
  const { authState, userState } = useRecoilValue(userAtom);
  let text: string | null;
  if (authState !== AuthState.idle) {
    switch (authState) {
      case AuthState.loading:
        text = 'Loading...';
        break;
      case AuthState.signingIn:
        text = 'Signing In...';
        break;
      case AuthState.signingOut:
        text = 'Signing Out...';
        break;
      case AuthState.updatingProfile:
        text = 'Updating Profile...';
        break;
      default:
        text = null;
    }
    return (
      <CommonPageLayout
        sxBodyProps={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Box>{text}</Box>
        <Loader />
      </CommonPageLayout>
    );
  }
  if (!userState) {
    return (
      <CommonPageLayout
        sxBodyProps={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Box>Sign In required</Box>
        <SignInButton />
      </CommonPageLayout>
    );
  }
  return <Outlet />;
}

function AdminRoutes() {
  const isAdmin = useRecoilValue(isAdminSelector);
  if (!isAdmin) {
    return <Navigate to={appAbsoluteRoutes.home} replace />;
  }
  return <Outlet />;
}

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
            path: appRelativeRoutes.cart,
            element: <CartPage />,
          },
          {
            path: appRelativeRoutes.profile,
            element: <ProfilePage />,
          },
          {
            path: appRelativeRoutes.admin,
            element: <AdminRoutes />,
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
              {
                path: appRelativeRoutes.adminLiveChat,
                element: <AdminLiveChatPage />,
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
