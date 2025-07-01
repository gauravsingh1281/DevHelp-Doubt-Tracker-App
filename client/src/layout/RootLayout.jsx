import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
export default function RootLayout() {
  return (
    <main>
      <Header />
      <Outlet />
      <ToastContainer />
    </main>
  );
}
