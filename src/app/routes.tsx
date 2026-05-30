import { createHashRouter, Navigate } from "react-router";
import { Home } from "./pages/Home";
import { OfferDetail } from "./pages/OfferDetail";
import { Cart } from "./pages/Cart";
import { Profile } from "./pages/Profile";
import { Favorites } from "./pages/Favorites";
import { Subscriptions } from "./pages/Subscriptions";
import { EcoRanking } from "./pages/EcoRanking";
import { CompostPartners } from "./pages/CompostPartners";
import { Auth } from "./pages/Auth";
import { SellerDashboard } from "./pages/SellerDashboard";
import { SellerSalesHistory } from "./pages/SellerSalesHistory";
import { ProtectedLayout } from "./components/ProtectedLayout";

export const router = createHashRouter([
  { path: "/auth", Component: Auth },
  {
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Home },
      { path: "/offer/:id", Component: OfferDetail },
      { path: "/cart", Component: Cart },
      { path: "/favorites", Component: Favorites },
      { path: "/profile", Component: Profile },
      { path: "/subscriptions", Component: Subscriptions },
      { path: "/eco-ranking", Component: EcoRanking },
      { path: "/compost-partners", Component: CompostPartners },
      { path: "/seller", Component: SellerDashboard },
      { path: "/seller/history", Component: SellerSalesHistory },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
