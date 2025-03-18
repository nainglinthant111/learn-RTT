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
    <>
      <Header />
      <main className="container mx-auto flex h-[calc(100vh-64px)] items-center justify-center">
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
    </>
  );
}

export default Error;
