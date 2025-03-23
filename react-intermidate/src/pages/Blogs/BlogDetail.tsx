import { useParams, Link } from "react-router-dom";
import { posts } from "@/data/posts";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Rishtextrener from "@/components/blog/Rishtextrener";
function BlogDetail() {
  const { postid } = useParams();
  const post = posts.find((post) => post.id === postid);
  return (
    <div className="container mx-auto px-4 lg:px-16">
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
        <section className="w-full lg:mt-24 lg:w-1/4">
          <div className="mb-8 flex items-center gap-2 text-base font-semibold">
            <Icons.layersIcon className="mr-2 h-4 w-4" />
            <h3 className="">Other Blog Posts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            {posts
              .filter((post) => post.id !== postid)
              .map((post) => (
                <Link
                  key={post.id}
                  to={`/blogs/${post.id}`}
                  className="mb-6 flex items-start gap-2"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-1/4 rounded"
                  />
                  <div className="text-muted-foreground w-3/4 text-sm font-[500]">
                    <p className="line-clamp-2">{post.content}</p>
                    <i className="">... see more</i>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </section>
    </div>
  );
}

export default BlogDetail;
