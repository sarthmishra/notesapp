import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Register screen
  const [showRegister, setShowRegister] = useState(false);
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // --------------------------------------------------
  // LOAD NOTES WHEN TOKEN EXISTS
  // --------------------------------------------------

  useEffect(() => {
    if (token) {
      fetchNotes(token);
    }
  }, [token]);

  // --------------------------------------------------
  // FETCH NOTES
  // --------------------------------------------------

  const fetchNotes = async (jwt) => {
    try {
      const response = await fetch(`${API_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        setError("Unable to load your notes.");
        return;
      }

      const data = await response.json();
      setNotes(data.content || []);
    } catch (error) {
      console.error(error);
      setError("Could not connect to the server.");
    }
  };

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoginLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Invalid username or password.");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (error) {
      console.error(error);
      setError("Could not connect to the server.");
    } finally {
      setLoginLoading(false);
    }
  };

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setRegisterLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerUsername.trim(),
          password: registerPassword,
        }),
      });

      const data = await response.text();

      if (!response.ok) {
        setError(data || "Registration failed.");
        return;
      }

      // Put registered username into login form
      setUsername(registerUsername.trim());
      setPassword("");

      // Clear registration fields
      setRegisterUsername("");
      setRegisterPassword("");

      // Return to login
      setShowRegister(false);

      setSuccess("Account created successfully. Please sign in.");
    } catch (error) {
      console.error(error);
      setError("Could not connect to the server.");
    } finally {
      setRegisterLoading(false);
    }
  };

  // --------------------------------------------------
  // CREATE NOTE
  // --------------------------------------------------

  const handleCreateNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("A title and some content are required.");
      return;
    }

    setError("");
    setSuccess("");
    setCreateLoading(true);

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        setError("Could not create the note.");
        return;
      }

      const newNote = await response.json();

      setNotes((current) => [newNote, ...current]);

      setTitle("");
      setContent("");

      setSuccess("Note created.");
    } catch (error) {
      console.error(error);
      setError("Could not connect to the server.");
    } finally {
      setCreateLoading(false);
    }
  };

  // --------------------------------------------------
  // DELETE NOTE
  // --------------------------------------------------

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note permanently?")) {
      return;
    }

    setError("");
    setSuccess("");
    setActionLoading(`delete-${id}`);

    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        setError("Could not delete the note.");
        return;
      }

      setNotes((current) =>
          current.filter((note) => note.id !== id)
      );

      setSuccess("Note deleted.");
    } catch (error) {
      console.error(error);
      setError("Could not connect to the server.");
    } finally {
      setActionLoading(null);
    }
  };

  // --------------------------------------------------
  // START EDITING
  // --------------------------------------------------

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);

    setError("");
    setSuccess("");
  };

  // --------------------------------------------------
  // CANCEL EDIT
  // --------------------------------------------------

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  // --------------------------------------------------
  // UPDATE NOTE
  // --------------------------------------------------

  const handleUpdate = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) {
      setError("A title and some content are required.");
      return;
    }

    setError("");
    setSuccess("");
    setActionLoading(`edit-${id}`);

    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
        }),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        setError("Could not update the note.");
        return;
      }

      const updatedNote = await response.json();

      setNotes((current) =>
          current.map((note) =>
              note.id === id ? updatedNote : note
          )
      );

      cancelEditing();

      setSuccess("Note updated.");
    } catch (error) {
      console.error(error);
      setError("Could not connect to the server.");
    } finally {
      setActionLoading(null);
    }
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setNotes([]);

    setUsername("");
    setPassword("");

    setTitle("");
    setContent("");

    setError("");
    setSuccess("");
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter(
        (note) =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
    );
  }, [notes, search]);

  // ==================================================
  // LOGIN / REGISTER
  // ==================================================

  if (!token) {
    // ------------------------------------------------
    // REGISTER SCREEN
    // ------------------------------------------------

    if (showRegister) {
      return (
          <div className="auth-page">
            <div className="auth-panel">
              <div className="brand-mark">N</div>

              <p className="eyebrow">PERSONAL NOTES</p>

              <h1>Create your account.</h1>

              <p className="auth-description">
                Start keeping the things worth remembering.
              </p>

              <form
                  className="auth-form"
                  onSubmit={handleRegister}
              >
                <div className="field">
                  <label>Username</label>

                  <input
                      type="text"
                      value={registerUsername}
                      onChange={(e) =>
                          setRegisterUsername(e.target.value)
                      }
                      placeholder="Choose a username"
                      required
                  />
                </div>

                <div className="field">
                  <label>Password</label>

                  <input
                      type="password"
                      value={registerPassword}
                      onChange={(e) =>
                          setRegisterPassword(e.target.value)
                      }
                      placeholder="Choose a password"
                      required
                  />
                </div>

                <button
                    className="primary-button full-width"
                    type="submit"
                    disabled={registerLoading}
                >
                  {registerLoading
                      ? "Creating account..."
                      : "Create account"}
                </button>
              </form>

              {error && (
                  <div className="message error">
                    {error}
                  </div>
              )}

              {success && (
                  <div className="message success">
                    {success}
                  </div>
              )}

              <p className="auth-switch">
                Already have an account?{" "}
                <button
                    type="button"
                    className="link-button"
                    onClick={() => {
                      setShowRegister(false);
                      setError("");
                      setSuccess("");
                    }}
                >
                  Sign in
                </button>
              </p>

              <p className="auth-footer">
                React · Spring Boot · PostgreSQL
              </p>
            </div>
          </div>
      );
    }

    // ------------------------------------------------
    // LOGIN SCREEN
    // ------------------------------------------------

    return (
        <div className="auth-page">
          <div className="auth-panel">
            <div className="brand-mark">N</div>

            <p className="eyebrow">PERSONAL NOTES</p>

            <h1>Welcome back.</h1>

            <p className="auth-description">
              A quiet place for the things worth remembering.
            </p>

            <form
                className="auth-form"
                onSubmit={handleLogin}
            >
              <div className="field">
                <label>Username</label>

                <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    placeholder="Enter your UserName "
                    required
                />
              </div>

              <div className="field">
                <label>Password</label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                />
              </div>

              <button
                  className="primary-button full-width"
                  type="submit"
                  disabled={loginLoading}
              >
                {loginLoading
                    ? "Signing in..."
                    : "Sign in"}
              </button>
            </form>

            {error && (
                <div className="message error">
                  {error}
                </div>
            )}

            {success && (
                <div className="message success">
                  {success}
                </div>
            )}

            <p className="auth-switch">
              Don't have an account?{" "}
              <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    setShowRegister(true);
                    setError("");
                    setSuccess("");
                  }}
              >
                Create one
              </button>
            </p>

            <p className="auth-footer">
              React · Spring Boot · PostgreSQL
            </p>
          </div>
        </div>
    );
  }

  // ==================================================
  // MAIN NOTES APP
  // ==================================================

  return (
      <div className="app-shell">

        {/* HEADER */}

        <header className="topbar">
          <div className="topbar-inner">

            <div className="topbar-left">
              <div className="small-mark">N</div>

              <div>
              <span className="app-name">
                Notes
              </span>

                <span className="app-label">
                PERSONAL
              </span>
              </div>
            </div>

            <div className="account">
            <span>
              {username || "sarth"}
            </span>

              <button
                  className="logout-button"
                  onClick={handleLogout}
              >
                Log out
              </button>
            </div>

          </div>
        </header>

        <main className="workspace">

          {/* LEFT SIDE */}

          <aside className="composer">

            <div className="composer-heading">
              <p className="eyebrow">
                NEW NOTE
              </p>

              <h2>
                What's on your mind?
              </h2>

              <p>
                Write something down before it disappears.
              </p>
            </div>

            <form onSubmit={handleCreateNote}>

              <div className="field">
                <label>Title</label>

                <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    placeholder="A thought worth keeping"
                    maxLength={100}
                />
              </div>

              <div className="field">
                <label>Note</label>

                <textarea
                    value={content}
                    onChange={(e) =>
                        setContent(e.target.value)
                    }
                    placeholder="Start writing..."
                    maxLength={255}
                />

                <div className="field-footer">
                <span>
                  Markdown coming later
                </span>

                  <span>
                  {content.length}/255
                </span>
                </div>
              </div>

              <button
                  className="primary-button"
                  type="submit"
                  disabled={createLoading}
              >
                {createLoading
                    ? "Saving..."
                    : "Save note"}
              </button>

            </form>

            <div className="stack-info">
              SECURED WITH JWT
              <span>•</span>
              POSTGRESQL
            </div>

          </aside>

          {/* RIGHT SIDE */}

          <section className="notes-area">

            {/* ACCOUNT */}

            <div className="notes-account">
            <span className="signed-in">
              SIGNED IN AS
            </span>

              <strong>
                {username || "sarth"}
              </strong>

              <button
                  className="logout-button"
                  onClick={handleLogout}
              >
                Log out
              </button>
            </div>

            {/* NOTES HEADER */}

            <div className="notes-toolbar">

              <div className="notes-heading">

                <p className="eyebrow">
                  YOUR SPACE
                </p>

                <div className="notes-title-row">

                  <h2>
                    Your notes
                  </h2>

                  <span className="note-count">
                  {notes.length}
                </span>

                </div>

              </div>

              <div className="search-box">

                <input
                    type="search"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search notes..."
                />

              </div>

            </div>

            {/* MESSAGES */}

            {error && (
                <div className="message error">
                  {error}
                </div>
            )}

            {success && (
                <div className="message success">
                  {success}
                </div>
            )}

            {/* NOTES */}

            {filteredNotes.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    —
                  </div>

                  {search ? (
                      <>
                        <h3>
                          No matching notes
                        </h3>

                        <p>
                          Try a different search term.
                        </p>
                      </>
                  ) : (
                      <>
                        <h3>
                          Nothing here yet.
                        </h3>

                        <p>
                          Your first note is waiting
                          to be written.
                        </p>
                      </>
                  )}

                </div>

            ) : (

                <div className="notes-grid">

                  {filteredNotes.map((note) => (

                      <article
                          className="note-card"
                          key={note.id}
                      >

                        {editingId === note.id ? (

                            <div className="edit-mode">

                              <div className="field">
                                <label>
                                  Title
                                </label>

                                <input
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(
                                            e.target.value
                                        )
                                    }
                                />
                              </div>

                              <div className="field">
                                <label>
                                  Note
                                </label>

                                <textarea
                                    value={editContent}
                                    onChange={(e) =>
                                        setEditContent(
                                            e.target.value
                                        )
                                    }
                                />
                              </div>

                              <div className="card-actions">

                                <button
                                    className="primary-button small"
                                    onClick={() =>
                                        handleUpdate(
                                            note.id
                                        )
                                    }
                                    disabled={
                                        actionLoading ===
                                        `edit-${note.id}`
                                    }
                                >
                                  {actionLoading ===
                                  `edit-${note.id}`
                                      ? "Saving..."
                                      : "Save changes"}
                                </button>

                                <button
                                    className="text-button"
                                    onClick={cancelEditing}
                                >
                                  Cancel
                                </button>

                              </div>

                            </div>

                        ) : (

                            <>
                              <div className="note-card-top">

                        <span className="note-number">
                          {String(note.id).padStart(
                              2,
                              "0"
                          )}
                        </span>

                                <span className="note-status">
                          SAVED
                        </span>

                              </div>

                              <h3>
                                {note.title}
                              </h3>

                              <p className="note-content">
                                {note.content}
                              </p>

                              <div className="card-actions">

                                <button
                                    className="text-button"
                                    onClick={() =>
                                        startEditing(note)
                                    }
                                >
                                  Edit
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        handleDelete(
                                            note.id
                                        )
                                    }
                                    disabled={
                                        actionLoading ===
                                        `delete-${note.id}`
                                    }
                                >
                                  {actionLoading ===
                                  `delete-${note.id}`
                                      ? "Deleting..."
                                      : "Delete"}
                                </button>

                              </div>
                            </>

                        )}

                      </article>

                  ))}

                </div>

            )}

          </section>

        </main>

      </div>
  );
}

export default App;