import { useParams } from "react-router-dom";

function BlogDetail() {
    const { postid } = useParams();
    return <div>Hello : {postid}</div>;
}

export default BlogDetail;
