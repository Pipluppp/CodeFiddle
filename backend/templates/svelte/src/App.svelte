<script>
  let count = $state(0);

  const guides = [
    { label: "Svelte Tutorial", href: "https://svelte.dev/tutorial" },
    { label: "Svelte Docs", href: "https://svelte.dev/docs" },
    { label: "Vite Docs", href: "https://vitejs.dev/guide/" },
  ];
</script>

<main class="shell">
  <section class="hero">
    <div class="badge">Svelte ⚡ Vite</div>
    <h1>Welcome to the Svelte template</h1>
    <p>
      Edit <code>src/App.svelte</code> and save to see the preview update
      instantly. Try clicking the button below to watch state changes in action.
    </p>
  <button class="cta" onclick={() => (count += 1)}>
      Count is {count}
    </button>
    <p class="hint">
      Tip: The terminal automatically installs dependencies and starts the dev
      server for you.
    </p>
  </section>

  <section class="links">
    {#each guides as guide}
      <a class="link" href={guide.href} target="_blank" rel="noreferrer">
        {guide.label}
      </a>
    {/each}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: "Inter", system-ui, sans-serif;
    background: radial-gradient(circle at 20% 20%, #f5f3ff, #e0f2fe);
    min-height: 100vh;
  }

  .shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    gap: 3rem;
    padding: 3rem 1.5rem 4rem;
    color: #0f172a;
  }

  .hero {
    text-align: center;
    max-width: 640px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .badge {
    align-self: center;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #7c3aed;
    background: rgba(124, 58, 237, 0.12);
    border-radius: 999px;
    padding: 0.35rem 1.25rem;
  }

  h1 {
    font-size: 2.8rem;
    margin: 0;
  }

  p {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.6;
    color: #334155;
  }

  p code {
    background: rgba(15, 23, 42, 0.08);
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    font-family: "JetBrains Mono", monospace;
  }

  .cta {
    border: none;
    border-radius: 999px;
    padding: 0.85rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #ec4899, #f97316);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 18px 30px rgba(236, 72, 153, 0.22);
  }

  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 36px rgba(236, 72, 153, 0.3);
  }

  .hint {
    font-size: 0.95rem;
    color: #475569;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .link {
    color: #0f172a;
    text-decoration: none;
    padding: 0.6rem 1.1rem;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(255, 255, 255, 0.85);
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .link:hover {
    background: rgba(15, 23, 42, 0.08);
    border-color: rgba(15, 23, 42, 0.25);
  }
</style>
