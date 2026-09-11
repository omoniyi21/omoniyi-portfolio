# Publishing Observations

This portfolio is a static React/Vite site, with no CMS or Beehiiv post feed. Its existing article has been moved intact into `src/data/observations.js`.

Add each article to `observations` with a unique `slug`, `number`, `status: "published"`, an ISO `publishedAt` timestamp, `dateLabel`, `category`, `title`, `excerpt`, and `paragraphs` array. Optional `notes` maps paragraph indexes to margin notes; optional `image` and `imageAlt` provide a homepage cover image. Deploy the site through the existing publishing workflow.

The homepage and archive automatically sort published entries by publication time, newest first. The homepage displays the first article as its cover and up to two more as supporting notes. Drafts, invalid dates, and future timestamps are excluded. Article routes resolve from the same collection; no route or homepage editing is needed for a new post. Publishing only in Beehiiv does not publish an article to this site.

The existing article only specified August 2026, so its sorting timestamp uses August 1; its visible date remains August 2026.

The signup uses the supplied Beehiiv loader and attribution scripts. Its internal copy and form appearance are managed in Beehiiv.
