import portrait from "../assets/images/portfolio-personal-effects-assets/png/candid-pic-me.png";

const current = [
  ["Watching", "FROM", "several theories in progress."],
  ["Recent favorite", "I Love Boosters", ""],
  ["Morning ritual", "Coffee, then walking the dogs", ""],
  ["Reading", "The Artist’s Way", ""],
  ["Listening to", "Good Noticings", "with Ashley and Claire"],
  ["Based in", "Dallas, Texas", ""],
  ["Designing", "Enterprise products + systems", ""],
];

export default function About() {
  return (
    <main className="about-page">
      <div className="about-page__masthead"><span><b>03</b> Design dossier <i>✦</i></span><span>Field notes · vol. 02</span></div>
      <article className="about-dossier">
        <header className="about-dossier__header"><span>About / Omoniyi Alimi</span><span>Issue 02 · 009</span></header>
        <section className="about-dossier__lead">
          <div className="about-dossier__intro">
            <h1>I spend a lot<br />of time trying<br />to understand<br />how things work.</h1>
            <p className="about-dossier__kicker">Products, systems, stories,<br />and everything in between.</p>
            <h2>Hi, I’m Omoniyi.</h2>
            <p>Sometimes that means untangling a messy enterprise workflow. Sometimes, it means falling down a rabbit hole about why a product feels so intuitive. Other times, it means finishing a movie and immediately needing to talk about what I think the ending actually meant.</p>
            <p>My thoughts rarely move in a straight line. One question opens ten more. A movie reminds me of a book. A city changes how I think about home. A beautifully designed object makes me wonder why some things simply feel right.</p>
            <p className="about-dossier__closing">That’s probably why product design fits me so well.</p>
          </div>
          <figure className="about-dossier__portrait"><img src={portrait} alt="Omoniyi seated in front of a colorful bookshelf" /></figure>
          <div className="about-dossier__scale">
            <h2>Finding beauty in scale</h2>
            <p>For more than nine years, I’ve partnered with government agencies, healthcare organizations, and enterprise teams to modernize legacy systems and make people’s work a little easier.</p>
            <p>I’m drawn to complicated environments with a lot of moving parts. I ask questions, listen closely, and look beneath the obvious problem. I map how people, information, decisions, and constraints relate. Then I connect the pieces into something coherent.</p>
            <p>My work includes product strategy, research, interaction design, prototyping, accessibility, and design systems. But my greatest talent might be word building.</p>
          </div>
          <aside className="about-dossier__quote"><span>Field note / 01</span><blockquote>“Good UX isn’t<br />decoration.<br />It’s hospitality.”</blockquote><small>Clarity · care · coherence</small></aside>
          <p className="about-dossier__annotation">I’m usually collecting something:<br />a reference, a theory, a detail.</p>
        </section>
        <section className="about-dossier__beyond">
          <div>
            <p className="about-dossier__eyebrow">Beyond the work <i>✦</i></p>
            <h2>The worlds beyond work</h2>
            <p>I appreciate things that feel intentional. A beautifully designed chair. An interesting building. A great pair of books. A home that makes people want to stay. A product that quietly solves a problem without asking for attention.</p>
            <p>There’s also a good chance I’m watching something. Right now, I’m completely invested in FROM and always down to trade theories. One of my favorite recent watches is I Love Boosters. I love stories that stay with you.</p>
            <p>I’m also into fashion, travel, photography, architecture, books, and finding inspiration in unexpected places. I’m happiest learning something complicated, or spending time with people I love.</p>
            <p className="about-dossier__closing">Thoughtfully made. Deeply lived.<br />Spacious enough to remain curious.</p>
          </div>
          <div className="about-current"><p>Currently</p><div>{current.map(([label, value, detail]) => <section key={label}><span>{label}</span><h3>{value}</h3>{detail && <small>{detail}</small>}</section>)}</div></div>
        </section>
        <footer className="about-dossier__footer"><span>Words + design by Omoniyi Alimi</span><span>Next: How I work ↗</span></footer>
      </article>
    </main>
  );
}
