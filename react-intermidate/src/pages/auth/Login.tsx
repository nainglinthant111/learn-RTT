import { Icons } from "@/components/icons";
import LoginForm from "@/components/auth/login-form";
import { Link } from "react-router-dom";
import Banner from "@/data/images/house.webp";
function Login() {
  return (
    <div className="relative">
      <Link
        to="/"
        className="text-foreground/80 fixed top-6 left-8 items-center text-lg font-bold tracking-tight"
      >
        <div className="flex">
          <Icons.logo aria-hidden="true" className="mr-2 size-6" />
          <span>Furniture Shop</span>
        </div>
      </Link>
      <main className="colun grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex w-full place-items-center justify-center">
          <LoginForm />
        </div>
        <div className="relative hidden size-full lg:block">
          <img
            src={Banner}
            className="absolute inset-0 size-full object-cover"
            alt="Furniture Shop"
          />
        </div>
      </main>
    </div>
  );
}

export default Login;
