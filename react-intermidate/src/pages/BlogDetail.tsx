import { useParams, Link } from "react-router-dom";
import { posts } from "@/data/posts";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Rishtextrener from "@/components/blog/Rishtextrener";
function BlogDetail() {
  const { postid } = useParams();
  const post = posts.find((post) => post.id === postid);
  return (
    <div className="container mx-auto lg:px-16">
      <section className="flex flex-col lg:flex-row">
        <section className="w-full lg:w-3/4 lg:pr-4">
          <Button variant={"outline"} asChild className="mt-8 mb-6">
            <Link to="/blogs">
              <Icons.arrowLeft className="mr-2 h-4 w-4" /> All Posts
            </Link>
          </Button>
          {post ? (
            <>
              <h2 className="mb-3 text-3xl font-extrabold">{post.title}</h2>
              <div className="">
                <span className="">
                  by<span className="mx-2 font-[600]">{post.author}</span>on
                  <span className="font-[600]"> {post.updatedAt}</span>
                </span>
              </div>
              <h3 className="my-6 text-base font-[400]">{post.content}</h3>
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded-xl"
              />
              <Rishtextrener content={post.body} className="my-8" />
              <div className="mb-12 space-x-2">
                {post.tags.map((tag) => (
                  <Button variant={"secondary"}>{tag}</Button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground mt-16 mb-8 text-center text-xl font-bold">
              No posts found.
            </p>
          )}
        </section>
        <section className="lg:1/4 w-full lg:mt-24"></section>
      </section>
    </div>
  );
}

export default BlogDetail;
