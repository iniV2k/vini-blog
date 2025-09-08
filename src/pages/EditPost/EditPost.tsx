// React Hooks
import { useEffect, useState } from "react";

// CSS
import styles from "./EditPost.module.css";

// Custom Hook
import { useUpdateDocument } from "../../hooks/useUpdateDocument";

// Navegacao
import { useNavigate, useParams } from "react-router-dom";

// Interface
import type { Post } from "../../interfaces/Post";

// Custom Hook
import { useFetchDocument } from "../../hooks/useFetchDocument";

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const { document: post, loading } = useFetchDocument<Post>("posts", id);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setImage(post.image);
      setTags(post.tags.join(", "));
    }
  }, [post]);

  const { updateDocument, response } = useUpdateDocument("posts");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setFormError(null);

    try {
      new URL(image);
    } catch (error) {
      setFormError("A imagem precisa ser uma URL válida.");
      return;
    }

    if (!title || !image || !tags || !body) {
      setFormError("Por favor, preencha todos os campos!");
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim().toLocaleLowerCase());

    const dataToUpdate = {
      title,
      image,
      body,
      tags: tagsArray,
    };

    if (id) {
      updateDocument(id, dataToUpdate);
    }

    navigate("/dashboard");
  };

  return (
    <div className={styles.edit_post}>
      {loading && <p>Carregando post...</p>}
      {post && (
        <>
          <h2>Editando post: {post.title}</h2>
          <p>Faça alterações na sua publicação</p>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Título:</span>
              <input
                type="text"
                name="title"
                required
                placeholder="Pense num bom título..."
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </label>
            <label>
              <span>URL da imagem:</span>
              <input
                type="text"
                name="imagem"
                required
                placeholder="Insira uma imagem que representa seu post"
                onChange={(e) => setImage(e.target.value)}
                value={image}
              />
            </label>
            <p className={styles.preview_title}>Preview da imagem:</p>
            <img
              className={styles.image_preview}
              src={image ? image : post.image}
              alt={title}
            />
            <label>
              <span>Conteúdo:</span>
              <textarea
                name="body"
                required
                placeholder="Insira o conteúdo do seu post"
                onChange={(e) => setBody(e.target.value)}
                value={body}
              ></textarea>
            </label>
            <label>
              <span>Tags:</span>
              <input
                type="text"
                name="tags"
                required
                placeholder="Insira as tags separadas por vírgula"
                onChange={(e) => setTags(e.target.value)}
                value={tags}
              />
            </label>
            {!response.loading && (
              <button className={styles.btn_confirm_edit}>
                Confirmar alterações
              </button>
            )}
            {response.loading && (
              <button className={styles.btn_confirm_edit} disabled>
                Aguarde...
              </button>
            )}
            {response.error && <p className="erro">{response.error}</p>}
            {formError && <p className="erro">{formError}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default EditPost;
