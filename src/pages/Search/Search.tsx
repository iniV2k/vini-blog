// Link
import { Link } from "react-router-dom";

// Components
import PostDetail from "../../components/PostDetail/PostDetail";

// Custom Hooks
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQuery } from "../../hooks/useQuery";

// CSS
import styles from "./Search.module.css";

interface Post {
  id: string;
  title: string;
  image: string;
  body: string;
  tags: string[];
  createdBy: string;
  uid: string;
}

const Search = () => {
  const query = useQuery();
  const rawSearchTerm = query.get("q");
  const search = rawSearchTerm?.toLowerCase() || "";

  const { documents: posts, loading } = useFetchDocuments<Post>(
    "posts",
    search
  );

  return (
    <div className={styles.search_container}>
      <h2>Resultados para a busca: {rawSearchTerm}</h2>
      <div className={styles.post_list}>
        {loading && <p>Carregando...</p>}
        {!loading && posts && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts a partir da sua busca...</p>
            <Link to="/" className="btn btn-dark">
              Voltar
            </Link>
          </div>
        )}
        {!loading &&
          posts &&
          posts.map((post) => <PostDetail key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default Search;
