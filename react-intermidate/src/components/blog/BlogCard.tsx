import { Post } from "@/types";
import { Link } from "react-router-dom";
interface PostProps {
  posts: Post[];
}
function BlogCard({ posts }: PostProps) {
  return (
    <div className="my-8 grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-0">
      {posts.map((post) => (
        <Link key={post.id} to={`/blogs/${post.id}`}>
          <img
            src={post.image}
            alt={post.title}
            className="mb-4 w-full rounded-2xl"
          />
          <h3 className="ml-4 line-clamp-1 font-semibold">{post.title}</h3>
          <div className="mt-2 ml-4 text-sm">
            <span className="">
              by<span className="mx-2 font-semibold">{post.author}</span>on
              <span className="font-semibold"> {post.updatedAt}</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export default BlogCard;
