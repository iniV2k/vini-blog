// Navegacao
import { Link } from "react-router-dom";

// Custom Hook
import useAuthContext from "../../hooks/useAuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

// CSS
import styles from "./Dashboard.module.css";

// Interface
import type { Post } from "../../interfaces/Post";

const Dashboard = () => {
  const { user } = useAuthContext();

  if (!user) return;

  const uid = user.uid;

  const { documents: posts, loading } = useFetchDocuments<Post>(
    "posts",
    null,
    uid
  );

  const { deleteDocument, response } = useDeleteDocument("posts");

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <p>Gerencie os seus posts</p>
      {posts && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Não foram encontrados posts</p>
          <Link to="/posts/create" className="btn">
            Criar primeiro post
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.post_header}>
            <span>Título</span>
            <span>Ações</span>
          </div>
          {posts.map((post) => (
            <div key={post.id} className={styles.post_row}>
              <p>{post.title}</p>
              <div>
                <Link to={`/posts/${post.id}`} className="btn btn-outline">
                  Ver
                </Link>
                <Link to={`/posts/edit/${post.id}`} className="btn btn-outline">
                  Editar
                </Link>
                <button
                  onClick={() => deleteDocument(post.id)}
                  className="btn btn-outline btn-danger"
                  disabled={response.loading}
                >
                  {response.loading ? "Excluíndo..." : "Excluir"}
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Dashboard;
