<script setup>
import { ref } from "vue";

import CodeFiddleLogo from "./assets/codefiddle-badge.svg";
import VueLogo from "./assets/vue.svg";

const count = ref(0);

const resources = [
  { label: "Vue Docs", href: "https://vuejs.org/guide/introduction.html" },
  { label: "Vite Docs", href: "https://vitejs.dev/guide/" },
  { label: "Vue School", href: "https://vueschool.io/" },
];
</script>

<template>
  <main class="wrapper">
    <header class="hero">
      <div class="logo-stack">
        <img class="logo" :src="VueLogo" alt="Vue logo" />
        <span class="plus">+</span>
        <img class="logo" :src="CodeFiddleLogo" alt="CodeFiddle logo" />
      </div>
      <h1>Vue + Vite</h1>
      <p class="tagline">
        Edit <code>src/App.vue</code> to start crafting your UI.
        Changes save instantly thanks to hot module replacement.
      </p>
      <button class="cta" type="button" @click="count++">
        Clicks: {{ count }}
      </button>
      <p class="hint">
        Open the terminal panel below to install packages or run Vue CLI commands.
      </p>
    </header>

    <section class="links">
      <a
        v-for="item in resources"
        :key="item.href"
        class="link"
        :href="item.href"
        target="_blank"
        rel="noreferrer"
      >
        {{ item.label }}
      </a>
    </section>
  </main>
</template>

<style scoped>
.wrapper {
  min-height: 100vh;
  display: grid;
  place-items: center;
  gap: 3rem;
  padding: 3rem 1.5rem 4rem;
  background: linear-gradient(145deg, #f0f9ff, #e0e7ff);
  color: #0f172a;
  font-family: "Inter", system-ui, sans-serif;
}

.hero {
  text-align: center;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.logo-stack {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
}

.logo {
  width: 100px;
  height: auto;
}

.plus {
  font-size: 2.5rem;
  color: #2563eb;
  font-weight: 600;
}

h1 {
  font-size: 2.8rem;
  margin: 0;
}

.tagline {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #334155;
}

.tagline code {
  background: rgba(37, 99, 235, 0.12);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-family: "JetBrains Mono", "Fira Code", monospace;
}

.cta {
  border: none;
  border-radius: 999px;
  padding: 0.85rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #10b981, #14b8a6);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 18px 30px rgba(20, 184, 166, 0.22);
}

.cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 36px rgba(20, 184, 166, 0.3);
}

.hint {
  color: #475569;
  font-size: 0.95rem;
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
  background: rgba(255, 255, 255, 0.8);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.link:hover {
  background: rgba(15, 23, 42, 0.08);
  border-color: rgba(15, 23, 42, 0.25);
}
</style>
