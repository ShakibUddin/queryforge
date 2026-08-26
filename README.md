# ⚡ QueryForge

### A real SQL engine running entirely in your browser.

QueryForge is a browser-based SQL playground powered by **SQLite + WebAssembly**.

Import CSV or JSON datasets, automatically infer their schema, load them into a real SQLite database running inside the browser, and execute genuine SQL — including joins, aggregations, subqueries, and more.

**No backend. No database server. No data leaving your browser.**

---

## ✨ Why QueryForge?

Most browser-based data tools either:

- send your data to a backend
- use a custom JavaScript query implementation
- provide only basic filtering
- require a database server

QueryForge takes a different approach.

```text
                 Your Browser
                      │
                      ▼
              ┌───────────────┐
              │    QueryForge │
              └───────┬───────┘
                      │
                      ▼
             ┌─────────────────┐
             │ SQLite / WASM   │
             └────────┬────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       users      employees    products
          │           │           │
          └───────────┼───────────┘
                      ▼
                  SQL Query
                      │
                      ▼
                 Result Table
