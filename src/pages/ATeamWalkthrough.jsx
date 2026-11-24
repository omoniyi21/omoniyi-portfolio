import { useRef } from "react";
import { Link } from "react-router-dom";
import { trackEvent } from "../lib/analytics";
import "./ateam-walkthrough.css";

// Unlisted walkthrough for the A.Team Product Designer mission. Not linked
// from the site, left out of the sitemap, and served with noindex (see
// pageMetadata.js and public/_headers). Share the link directly.

const VIDEO = "/media/ateam-walkthrough.mp4";
const POSTER = "/media/ateam-walkthrough-poster.webp";
const VIDEO_NAME = "ateam_walkthrough";

const ANSWER = [
  {
    title: "Private vs. shared",
    body: "I gave it two front doors. Client tools live on omoniyistudio.com, and my working tools live on a separate domain, so nothing private leaks into the shared space by accident. Clients sign in with an email link and see only their own project room. They own their domain, analytics and accounts, and they grant me access, so ownership is clear in how the setup works.",
  },
  {
    title: "Agents draft, people decide",
    body: "Claude scores leads, drafts outreach and runs my site diagnosis skill. Drafted and sent are separate states, and anything client-facing waits for my approval. Routine work, like my daily next steps, runs on its own.",
  },
  {
    title: "Showing what agents did",
    body: "OUT LOUD's agent works under written rules. It never touches data it wasn't asked to touch, and it confirms every write by reading it back. If a change can't be verified, it isn't done. Each client room also shows where the work stands, act by act, so nobody has to ask.",
  },
];

const TRANSCRIPT = [
  "Hello, my name is Omoniyi Alimi, and I am applying for the product designer role with Stealth, from A.Team. I wanted to share with you how I use multiple agents, as well as multiple people entering different portals, that I built with Claude and ChatGPT.",
  "So here, for my design studio, I use a portal where clients can get into a project room with their email, which is plugged in through the back end. I do have experience with backend engineering, but I also used the help of Claude and ChatGPT to get this set up. Once we're given that email, we get a direct email, and this goes to clients as well. Over to the project rooms.",
  "Each project room is dedicated to each client. If you are 6IX Chocolate, you would only see 6IX Chocolate on this page. If you're TaeHamm, you would only see TaeHamm on this page. So we do have security for that. Here we also have step-by-step directions for me to set up these project rooms.",
  "Then through here, we get to the portal the client sees, and my AI agent works with me, with my approval, to update the plans and what's going on on this page, based on our pipeline. The client can open up their draft site. This is truly the hub of all changes going on in their website. I really leaned into the studio idea, where each room has different acts, and you're currently in Act 2. Then we have a list of things we need from the client. They can click here to answer by email and send that over to me. Then we have the before and after: what changed. So again, this is a hub where clients can get information, and they have a toolbox they can plug and play for Square access, domain or analytics, anything I might need to move forward.",
  "So that is one of the portals I've used Claude and ChatGPT to create, and I use them as a pipeline to update it based on what I've put in Notion. Then they go forward from there.",
  "I also have a tools portal. It works like the Studio portal I just showed: you log in with an email, and then you go from here to sign into Tools. There's the link tagger, and any accounting I'm doing personally. And here is my planner, where again I use my AI agent to organize my day and the work we're doing. It's connected directly to my Notion, so it has steady updates as I start my day, and it helps me prioritize what's next for the week and what this season is asking of me.",
  "Here in Career, as well as Studio, we can see what's been worked on, who's been contacted, and what needs more research. Based on my communication through Claude and my Claude skill, Claude will take actions or ask me for next steps.",
  "I think that covers the work I've done with agents and multiple people using the same portal, and how they interact. I make sure my agents ask for approval on anything pertinent, anything that could cause breaks, or anything client-facing. Daily updates and straightforward tasks, like my next steps or which jobs to add to the pipeline that day, are automated.",
  "Thank you so much for taking the time to step through this with me. I hope to speak with you all soon.",
];

function useVideoTracking() {
  const sent = useRef(new Set());
  const once = (name, extra = {}) => {
    if (sent.current.has(name)) return;
    sent.current.add(name);
    trackEvent(name, { video_name: VIDEO_NAME, ...extra });
  };
  return {
    onPlay: () => once("video_start"),
    onTimeUpdate: (event) => {
      const { currentTime, duration } = event.currentTarget;
      if (!duration) return;
      const percent = (currentTime / duration) * 100;
      if (percent >= 50) once("video_progress", { video_percent: 50 });
    },
    onEnded: () => once("video_complete"),
  };
}

export default function ATeamWalkthrough() {
  const tracking = useVideoTracking();

  return (
    <main className="walkthrough" aria-labelledby="walkthrough-title">
      <header className="walkthrough__intro">
        <p className="walkthrough__eyebrow">A.Team · Product Designer mission</p>
        <h1 id="walkthrough-title">People and agents in one workspace</h1>
        <p className="walkthrough__note" aria-hidden="true">made for you, not for search</p>
      </header>

      <section className="walkthrough__question" aria-label="The question">
        <p className="walkthrough__label">The question</p>
        <p>Share a product you designed where multiple parties and AI agents worked in one workspace. How did you make clear who could see what and who approved what?</p>
      </section>

      <figure className="walkthrough__video">
        <video
          controls
          playsInline
          preload="metadata"
          poster={POSTER}
          width="1440"
          height="900"
          {...tracking}
        >
          <source src={VIDEO} type="video/mp4" />
          Your browser can't play this video. <a href={VIDEO}>Download it instead.</a>
        </video>
        <figcaption>A four-minute walkthrough of my Studio portal and my planner. Client names and contact details are blurred.</figcaption>
      </figure>

      <section className="walkthrough__answer" aria-labelledby="answer-title">
        <h2 id="answer-title">The short version</h2>
        <p className="walkthrough__lede">
          Omoniyi Studio runs on a shared workspace I designed and built with Claude and ChatGPT: a client portal, Notion as the system of record, and OUT LOUD, the planning product I'm building, whose agent runs daily check-ins against Notion and Google Calendar. Three kinds of participants work in it: me, my clients, and AI agents.
        </p>
        <div className="walkthrough__points">
          {ANSWER.map(({ title, body }) => (
            <article key={title} className="walkthrough__point">
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <p className="walkthrough__background">
          Before this I spent 9 years on regulated, multi-stakeholder systems (U.S. House voting, Library of Congress, healthcare at Athletico), where who sees what is the whole job.
        </p>
      </section>

      <details className="walkthrough__transcript">
        <summary>Read the transcript</summary>
        {TRANSCRIPT.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
      </details>

      <nav className="walkthrough__next" aria-label="More from Omoniyi">
        <Link to="/work">See my case studies</Link>
        <Link to="/resume">Résumé</Link>
        <a href="mailto:contact@omoniyialimi.com">contact@omoniyialimi.com</a>
      </nav>
    </main>
  );
}
