import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { OfferDetail } from "./pages/OfferDetail";
import { Cart } from "./pages/Cart";
import { Profile } from "./pages/Profile";
import { Favorites } from "./pages/Favorites";
import { Subscriptions } from "./pages/Subscriptions";
import { EcoRanking } from "./pages/EcoRanking";
import { CompostPartners } from "./pages/CompostPartners";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/offer/:id",
    Component: OfferDetail,
  },
  {
    path: "/cart",
    Component: Cart,
  },
  {
    path: "/favorites",
    Component: Favorites,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/subscriptions",
    Component: Subscriptions,
  },
  {
    path: "/eco-ranking",
    Component: EcoRanking,
  },
  {
    path: "/compost-partners",
    Component: CompostPartners,
  },
]);