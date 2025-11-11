import "./style.css";

interface ResourceLink {
  label: string;
  href: string;
}

const resources: ResourceLink[] = [
  { label: "TypeScript Handbook", href: "https://www.typescriptlang.org/docs/" },
  { label: "Type Challenges", href: "https://github.com/type-challenges/type-challenges" },
  { label: "Vite Guide", href: "https://vitejs.dev/guide/" },
];

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("Unable to find root element with id #app");
}

const container = document.createElement("div");
container.className = "card";
container.innerHTML = `
  <h1>Vanilla TypeScript</h1>
  <p>Edit <code>src/main.ts</code> to explore typed JavaScript in the browser.</p>
  <button type="button">Count is <span>0</span></button>
  <p class="hint">The dev server restarts automatically when you save changes.</p>
  <div class="links">
    ${resources
      .map(
        (resource) =>
          `<a href="${resource.href}" target="_blank" rel="noreferrer">${resource.label}</a>`
      )
      .join("")}
  </div>
`;

app.appendChild(container);

const button = container.querySelector<HTMLButtonElement>("button");
const counter = container.querySelector<HTMLSpanElement>("span");

if (!button || !counter) {
  throw new Error("Failed to construct counter UI");
}

let count = 0;
button.addEventListener("click", () => {
  count += 1;
  counter.textContent = count.toString();
});
