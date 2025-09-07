import { Link } from "react-router-dom";
import styles from "./PostDetail.module.css";
import type { Post } from "../../interfaces/Post";

const PostDetail = ({ post }: { post: Post }) => {
  return (
    <div className={styles.post_detail}>
      <img src={post.image} alt={post.title} />

      {/* Este contêiner é a chave para o layout flex funcionar */}
      <div className={styles.post_content_container}>
        {/* Agrupador para o conteúdo superior */}
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
