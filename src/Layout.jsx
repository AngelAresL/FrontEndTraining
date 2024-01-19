import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  AdminFavListPage,
  AdminTrainingDetail,
  AdminTrainingListPage,
  FavListPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  TrainingDetailPage,
  TrainingListPage,
} from "./pages";

import { useContext } from "react";
import { authContext } from "./context/AuthContext";

const Layout = () => {
  const [context, setContext] = useContext(authContext);
  const getRole = async () => {
    try {
      const req = await fetch("http://localhost:3001/verify", {
        headers: { Authorization: `Bearer ${context?.token}` },
      });
      const body = await req.json();
      const role = await body.rol;

      setContext({ role });
    } catch (error) {
      console.error("Token no válido");
    }
  };
  if (context.token) {
    getRole();
  }

  const routes = [...routesWithoutAuth];

  if (context?.token && context?.role !== "admin") {
    routes.push(...routesWithAuth);
  } else if (context?.role === "admin") {
    routes.push(...routesAdmin);
  } else {
    routes.push(...loginRoutes);
  }

  const browserRoutes = createBrowserRouter(routes);

  return (
    <>
      <RouterProvider router={browserRoutes} />
    </>
  );
};

const routesAdmin = [
  {
    path: "/admin/entrenos",
    element: <AdminTrainingListPage />,
  },
  {
    path: "/admin/entreno/:idtraining",
    element: <AdminTrainingDetail />,
  },
  {
    path: "/admin/favoritos",
    element: <AdminFavListPage />,
  },
];

const routesWithAuth = [
  {
    path: "/entrenos",
    element: <TrainingListPage />,
  },
  {
    path: "/favoritos",
    element: <FavListPage />,
  },
  {
    path: "/entreno/:trainingId",
    element: <TrainingDetailPage />,
  },
];

const routesWithoutAuth = [
  {
    path: "*",
    element: <HomePage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
];

const loginRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/registro",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password/:temp",
    element: <ResetPasswordPage />,
  },
];

export default Layout;