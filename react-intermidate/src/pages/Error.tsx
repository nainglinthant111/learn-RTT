import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
function Error() {
  return (
    <div className="flex min-h-screen flex-col justify-between space-y-8">
      <Header />
      <main className="container mx-auto flex h-full items-center justify-center">
        <Card className="w-[350px] md:w-[500px]">
          <CardHeader>
            <CardTitle className="text-center">Oops!</CardTitle>
            <CardDescription className="text-center">
              An error occurs accidently.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link to="/">
              <Button variant={"outline"}>Go to Home Page !</Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default Error;
