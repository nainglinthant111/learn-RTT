import BlogPostList from "@/components/blog/BlogPostList";
import { posts } from "@/data/posts";

function Blog() {
  return (
    <div className="container mx-auto lg:px-16">
      <h1 className="mt-8 text-center text-2xl font-bold md:text-left">
        Latest Blog Posts
      </h1>
      <BlogPostList
        posts={posts.map((post) => ({ ...post, id: String(post.id) }))}
      />
    </div>
  );
}

export default Blog;
