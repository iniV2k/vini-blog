// Navegacao
import { Link } from "react-router-dom";

// CSS
import styles from "./PostDetail.module.css";

// Interface
import type { Post } from "../../interfaces/Post";
import useAuthContext from "../../hooks/useAuthContext";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

const PostDetail = ({ post }: { post: Post }) => {
  const { user } = useAuthContext();
  const { deleteDocument, response } = useDeleteDocument("posts");

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
        <Link to={`/posts/${post.id}`} className={styles.details_button}>
          Ver detalhes
        </Link>
        {user?.uid === "quBaKxYWdTgu0xYBOf0z1Woq0Wn1" && (
          <button
            className="btn btn-outline btn-danger"
            onClick={() => deleteDocument(post.id)}
            disabled={response.loading}
          >
            {response.loading ? "Apagando..." : "Excluir"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
