import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutation";
import type { Models } from "appwrite";
import { Loader } from "lucide-react";


const Home = () => {
  const { data: posts, isPending: isPostsLoading, isError: isErrorPosts } = useGetRecentPosts();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostsLoading && !posts ? (
            <Loader />
          ): (
            <ul className="flex flex-col gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.caption} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
