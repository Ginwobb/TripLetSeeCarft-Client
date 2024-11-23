import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Unauthorization from "../pages/Unauthorization";
import PageNotFound from "../pages/PageNotFound";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import useUserStore from "../stores/userStore";
import Dashboard from "../pages/admin/Dashboad";
import UserManagement from "../pages/admin/UserManagement";
import TripManagement from "../pages/admin/TripManagement";
import PlaceManagement from "../pages/admin/PlaceManagement";
import PlanPage from "../pages/user/PlanPage";
import CreatedTrip from "../pages/user/CreatedTrip";
import ProfilePage from "../pages/user/ProfilePage";
import TripDetailPage from "../pages/user/TripDetailPage";
import ProtectedRoute from "../components/ProtectedRoute";
import MapMarker from "../components/user/MapMarker";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <Home /> },
      { path: "unauthorization", element: <Unauthorization /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
  {
    path: "/user",
    element: <ProtectedRoute element={<UserLayout/>} allowedRoles={["USER"]}/>,
    children: [
      {
        index: true,
        element: (
            <Home />
        ),
      },
      {
        path: "plan",
        element: (
            <PlanPage />
        ),
      },
      {
        path: "create-trip",
        element: (
            <CreatedTrip />
        ),
      },
      {
        path: "profile",
        element: (
            <ProfilePage />
        ),
      },
      {
        path: "trip-detail",
        element: (
            <TripDetailPage />
        ),
      },
      {
        path: "maps-marker",
        element: (
            <MapMarker />
        ),
      },
      { path: "unauthorization", element: <Unauthorization /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
  {
    path: "/admin",
    element:<ProtectedRoute element={<AdminLayout />} allowedRoles={["ADMIN"]}/>,
    children: [
      {
        index: true,
        element: (
            <Dashboard />
        ),
      },
      {
        path: "users",
        element: (
            <UserManagement />
        ),
      },
      {
        path: "trips",
        element: (
            <TripManagement />
        ),
      },
      {
        path: "places",
        element: (
            <PlaceManagement />
        ),
      },
      { path: "unauthorization", element: <Unauthorization /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

const AppRoute = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default AppRoute;
