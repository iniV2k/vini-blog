// React Hook
import { useState } from "react";

// CSS
import styles from "./Home.module.css";

// Navegacao
import { Link, useNavigate } from "react-router-dom";

// Custom Hook
import { useFetchDocuments } from "../../hooks/useFetchDocuments";

// Component
import PostDetail from "../../components/PostDetail/PostDetail";

interface Post {
  id: string;
  title: string;
  image: string;
  body: string;
  tags: string[];
  createdBy: string;
  uid: string;
}

const Home = () => {
  const [query, setQuery] = useState("");
  const { documents: posts, loading, error } = useFetchDocuments<Post>("posts");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.home}>
        <h1>Carregando...</h1>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <h1>Veja os nossos posts mais recentes</h1>
      <form onSubmit={handleSubmit} className={styles.search_form}>
        <input
          type="text"
          placeholder="Ou busque por tags..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <button className={`${styles.search_button} btn btn-dark`}>
          Pesquisar
        </button>
      </form>

      <div className={styles.post_list}>
        {posts && posts.length > 0 ? (
          posts.map((post) => <PostDetail key={post.id} post={post} />)
        ) : (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts</p>
            <Link to="/posts/create" className="btn">
              Criar primeiro post
            </Link>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Home;
