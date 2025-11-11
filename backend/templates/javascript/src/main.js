import "./style.css";

const resources = [
  { label: "MDN Web Docs", href: "https://developer.mozilla.org/" },
  { label: "JavaScript Info", href: "https://javascript.info/" },
  { label: "Vite Guide", href: "https://vitejs.dev/guide/" },
];

const app = document.querySelector("#app");

const template = document.createElement("div");
template.className = "card";
template.innerHTML = `
  <h1>Vanilla JavaScript</h1>
  <p>Edit <code>src/main.js</code> to start experimenting.</p>
  <button type="button">Count is <span>0</span></button>
  <p class="hint">Open the terminal to install packages or run custom commands.</p>
  <div class="links">
    ${resources
      .map(
        (resource) =>
          `<a href="${resource.href}" target="_blank" rel="noreferrer">${resource.label}</a>`
      )
      .join("")}
  </div>
`;

app.appendChild(template);

const button = template.querySelector("button");
const counter = template.querySelector("span");
let count = 0;

button.addEventListener("click", () => {
  count += 1;
  counter.textContent = String(count);
});
