import Image from "next/image";
import Link from "next/link";

const highlights = [
	{
		title: "Zero friction dev server",
		description:
			"Turbopack powers instant feedback as you tweak components, add routes, or wire up new data sources.",
	},
	{
		title: "Typed from the start",
		description:
			"Strict TypeScript settings are enabled so you can rely on IDE autocompletion and catch issues early.",
	},
	{
		title: "Ready to deploy",
		description:
			"Keep using this layout or swap it out. When you're done, run the build script and deploy anywhere that speaks Next.js.",
	},
];

export default function Home() {
	return (
		<main className="page">
			<section className="hero">
				<Image
					className="logo"
					src="/codefiddle-logo.svg"
					alt="CodeFiddle mark"
					width={80}
					height={80}
					priority
				/>
				<span className="badge">Next.js + App Router</span>
				<h1>Kickstart a modern web app in minutes</h1>
				<p>
					This sandbox includes the essentials: routing, metadata, fonts, and a touch of styling. Extend it with API
					routes, server actions, or your favourite UI library.
				</p>
				<div className="actions">
					<Link className="primary" href="https://nextjs.org/docs/app">
						Documentation
					</Link>
					<Link
						className="ghost"
						href="https://github.com/vercel/next.js/tree/canary/examples"
						target="_blank"
						rel="noreferrer"
					>
						Explore examples
					</Link>
				</div>
			</section>

			<section className="grid">
				{highlights.map((item) => (
					<article key={item.title}>
						<h2>{item.title}</h2>
						<p>{item.description}</p>
					</article>
				))}
			</section>

			<section className="footnote">
				<p>
					Want to customise the look and feel? Start with <code>app/page.tsx</code> and <code>app/globals.css</code>.
				</p>
			</section>
		</main>
	);
}
