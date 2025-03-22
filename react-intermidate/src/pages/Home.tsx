import BlogCard from "@/components/blog/BlogCard";
import CarouselCard from "@/components/Products/CarouselCard";
import { Button } from "@/components/ui/button";
import Cosh from "@/data/images/couch.png";
import { posts } from "@/data/posts";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
function Home() {
  const samplePost = posts.slice(0, 3);
  const Title = ({
    title,
    href,
    sideTexts,
  }: {
    title: string;
    href: string;
    sideTexts: string;
  }) => (
    <div className="mt-28 mb-10 ml-8 flex flex-col md:justify-between lg:ml-0 lg:flex-row">
      <h2 className="mb-4 text-2xl font-bold md:mb-0">{title}</h2>
      <Link to={href} className="text-muted-foreground font-semibold underline">
        {sideTexts}
      </Link>
    </div>
  );

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
      <CarouselCard
        products={products.map((product) => ({
          ...product,
          id: Number(product.id),
        }))}
      />
      <Title title="Recent Blog" href="/blogs" sideTexts="View All Posts" />
      <BlogCard
        posts={samplePost.map((post) => ({
          ...post,
          id: Number(post.id),
        }))}
      />
    </div>
  );
}

export default Home;
