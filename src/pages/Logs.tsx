import { useEffect, useState, useCallback, type CSSProperties } from "react";
import { fetchLogs, type LogType } from "@/lib/logger";

const AUTH_USER = "HelpMultas";
const AUTH_PASS = "HelpMultas";
const AUTH_STORAGE_KEY = "__logs_authed";

type LogRow = {
  id: number;
  created_at: string;
  page: string;
  type: LogType;
  message: string;
  details: Record<string, unknown> | null;
  session_id: string;
  url: string;
};

const TYPE_LABELS: Record<string, string> = {
  pageview: "Pageview",
  action: "Ação",
  error: "Erro",
  pixel_event: "Evento Pixel",
  crm_success: "CRM ✓",
  crm_error: "CRM ✗",
};

const TYPE_COLORS: Record<string, string> = {
  pageview: "#64748b",
  action: "#2563eb",
  error: "#dc2626",
  pixel_event: "#7c3aed",
  crm_success: "#16a34a",
  crm_error: "#dc2626",
};

function useAuth() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const login = (user: string, pass: string) => {
    if (user === AUTH_USER && pass === AUTH_PASS) {
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setAuthed(true);
      return true;
    }
    return false;
  };

  return { authed, login };
}

function LoginScreen({ onLogin }: { onLogin: (user: string, pass: string) => boolean }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = onLogin(user, pass);
    setError(!ok);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", background: "#0f172a" }}>
      <form
        onSubmit={handleSubmit}
        style={{ background: "#fff", padding: 32, borderRadius: 12, width: 320, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#0f172a" }}>Logs — Login</h1>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: "#475569", display: "block", marginBottom: 4 }}>Usuário</label>
          <input
            autoFocus
            value={user}
            onChange={(e) => setUser(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#475569", display: "block", marginBottom: 4 }}>Senha</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          />
        </div>
        {error && <p style={{ color: "#dc2626", fontSize: 12, marginBottom: 12 }}>Usuário ou senha inválidos.</p>}
        <button
          type="submit"
          style={{ width: "100%", padding: "10px 0", borderRadius: 8, border: "none", background: "#0f172a", color: "#fff", fontWeight: 600, cursor: "pointer" }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

function DetailsCell({
  details,
  onOpen,
}: {
  details: Record<string, unknown> | null;
  onOpen: (details: Record<string, unknown>) => void;
}) {
  if (!details || Object.keys(details).length === 0) {
    return <span style={{ color: "#94a3b8" }}>—</span>;
  }
  return (
    <button
      onClick={() => onOpen(details)}
      style={{
        fontSize: 12,
        color: "#2563eb",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        textDecoration: "underline",
        whiteSpace: "nowrap",
      }}
    >
      ver detalhes
    </button>
  );
}

function DetailsModal({
  details,
  onClose,
}: {
  details: Record<string, unknown>;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f172a",
          borderRadius: 12,
          width: "100%",
          maxWidth: 640,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>Detalhes</span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: 18,
              lineHeight: 1,
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <pre
          style={{
            margin: 0,
            padding: 16,
            fontSize: 12,
            color: "#e2e8f0",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {JSON.stringify(details, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function Logs() {
  const { authed, login } = useAuth();

  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageFilter, setPageFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [modalDetails, setModalDetails] = useState<Record<string, unknown> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLogs({
        limit: 300,
        page: pageFilter || undefined,
        type: typeFilter || undefined,
        search: search || undefined,
      });
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar logs.");
    } finally {
      setLoading(false);
    }
  }, [pageFilter, typeFilter, search]);

  useEffect(() => {
    if (!authed) return;
    load();
  }, [authed, load]);

  useEffect(() => {
    if (!authed || !autoRefresh) return;
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, [authed, autoRefresh, load]);

  if (!authed) {
    return <LoginScreen onLogin={login} />;
  }

  const uniquePages = Array.from(new Set(rows.map((r) => r.page))).sort();
  const uniqueTypes = Object.keys(TYPE_LABELS);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, sans-serif", padding: "24px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>
            Logs — Help Multas
          </h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
              Auto-atualizar (8s)
            </label>
            <button
              onClick={load}
              disabled={loading}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: "#fff",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {loading ? "Atualizando..." : "Atualizar agora"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <select
            value={pageFilter}
            onChange={(e) => setPageFilter(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, minWidth: 180 }}
          >
            <option value="">Todas as páginas</option>
            {uniquePages.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, minWidth: 160 }}
          >
            <option value="">Todos os tipos</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Buscar na mensagem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, flex: 1, minWidth: 200 }}
          />
        </div>

        {error && (
          <div style={{ padding: 12, background: "#fee2e2", color: "#991b1b", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                  <th style={thStyle}>Data/Hora</th>
                  <th style={thStyle}>Página</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Mensagem</th>
                  <th style={thStyle}>Sessão</th>
                  <th style={thStyle}>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                      Nenhum log encontrado.
                    </td>
                  </tr>
                )}
                {rows.map((row) => (
                  <tr key={row.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>
                      {new Date(row.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td style={tdStyle}>{row.page}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#fff",
                          background: TYPE_COLORS[row.type] || "#64748b",
                        }}
                      >
                        {TYPE_LABELS[row.type] || row.type}
                      </span>
                    </td>
                    <td style={tdStyle}>{row.message}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: "#94a3b8" }}>
                      {row.session_id?.slice(0, 10)}
                    </td>
                    <td style={tdStyle}>
                      <DetailsCell details={row.details} onOpen={setModalDetails} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>
          Mostrando até 300 registros mais recentes. Use os filtros para refinar.
        </p>
      </div>

      {modalDetails && (
        <DetailsModal details={modalDetails} onClose={() => setModalDetails(null)} />
      )}
    </div>
  );
}

const thStyle: CSSProperties = {
  padding: "10px 12px",
  fontWeight: 600,
  color: "#475569",
  whiteSpace: "nowrap",
};

const tdStyle: CSSProperties = {
  padding: "10px 12px",
  verticalAlign: "top",
  color: "#1e293b",
};
