// Navegacao
import { Link } from "react-router-dom";

// CSS
import styles from "./PostDetail.module.css";

// Interface
import type { Post } from "../../interfaces/Post";

const PostDetail = ({ post }: { post: Post }) => {
  return (
    <div className={styles.post_detail}>
      <img src={post.image} alt={post.title} />
      <div className={styles.post_content_container}>
        <div>
          <h2>{post.title}</h2>
          <p className={styles.createdby}>Por: {post.createdBy}</p>
          <div className={styles.tags}>
            {post.tags &&
              post.tags.map((tag: string) => (
                <p key={tag}>
                  <span>#</span>
                  {tag}
                </p>
              ))}
          </div>
        </div>
        <Link to={`/posts/${post.id}`} className="btn btn-outline">
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;
