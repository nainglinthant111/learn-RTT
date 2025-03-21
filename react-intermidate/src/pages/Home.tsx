import { Button } from "@/components/ui/button";
import Cosh from "@/data/images/couch.png";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="container mx-auto w-full lg:px-16">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="py-8 text-center lg:w-2/5 lg:pt-16 lg:pb-0 lg:text-left">
          <h1 className="mb-4 text-4xl font-extrabold text-[#3b5d50] lg:mb-8 lg:text-6xl">
            Modern Interior Design Studio
          </h1>
          <p className="mb-6 text-[#3b5d50] lg:mb-6">
            Furniture is an essential omponent of any iving space, providing
            functionality, style, and comfort.
          </p>
          <div className="space-x-2">
            <Button
              className="text-bold rounded-full bg-orange-300 px-8 py-6 text-base"
              asChild
            >
              <Link to="/">Shop Now</Link>
            </Button>
            <Button
              variant="outline"
              className="text-bold rounded-full px-8 py-6 text-base"
              asChild
            >
              <Link to="/">Explore</Link>
            </Button>
          </div>
        </div>
        <img src={Cosh} alt="cosh" className="w-full lg:w-3/5" />
      </div>
    </div>
  );
}

export default Home;
