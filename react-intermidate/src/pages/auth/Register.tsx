import { Icons } from "@/components/icons";
import RegisterForm from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Link
        to="/"
        className="text-foreground/80 fixed top-6 left-8 items-center text-lg font-bold tracking-tight"
      >
        <div className="flex">
          <Icons.logo aria-hidden="true" className="mr-2 size-6" />
          <span>Furniture Shop</span>
        </div>
      </Link>
      <RegisterForm />
    </div>
  );
}
export default Register;
