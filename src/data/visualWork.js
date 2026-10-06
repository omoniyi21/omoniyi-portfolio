// Visual & illustration archive. Illustration and promotional pieces, shown as supporting
// range for the studio rather than as full case studies.
const piece = (image, title, kind, role, body, extra = {}) => ({ image, title, kind, role, body, ...extra });

export const visualWork = {
  slug: 'visual',
  title: 'Drawn by hand, built for a brief.',
  summary:
    'Before product design had a name on my résumé, it was OMDesigns: illustration, hand lettering, and graphics for events and brands. That practice grew into Omoniyi Studio. These pieces show the visual side of the same designer: building a scene, setting type, and making a layout carry a mood.',
  groups: [
    {
      label: 'Marketing & event graphics',
      note: 'Product stories and event details, shaped for a clear next step.',
      pieces: [
        piece('visual-shes-royal', 'She’s Royal Beauty Collection', 'Product promotional graphic', 'Graphic design',
          'A vitamin C crème spotlight that brings the product, ingredients, and benefit messaging into one illustrated layout. A mint and peach palette gives each section its place while keeping the product at the center.'),
        piece('visual-acs-2025', 'ACS: 2025 All Surgeon’s Day', 'Event promotional flyer', 'Graphic design & layout',
          'A conference flyer for the American College of Surgeons, Metropolitan Washington DC Chapter. The layout balances a surgical image with the keynote, schedule, speakers, and event details in the chapter’s red, white, and navy palette.'),
        piece('visual-acs-joy', 'ACS: Joy in Surgery', 'Event promotional flyer', 'Graphic design & layout',
          'A keynote panel flyer for the American College of Surgeons, Metropolitan Washington DC Chapter. Speaker portraits and short biographies sit below a prominent headline, event time, and registration prompt.'),
      ],
    },
    {
      label: 'Scenes',
      note: 'Original illustration. Perspective, texture, and mood built from nothing.',
      pieces: [
        piece('visual-facades', 'Façades', 'Original illustration', 'Illustration',
          'Three buildings pressed into one frame, each window a glimpse of a different interior: a pendant lamp, a still-life on the wall, a gallery wall through a round window. Watercolor wash keeps the linework soft.'),
        piece('visual-paneled-room', 'Paneled room', 'Original illustration', 'Illustration',
          'A flat, front-on interior where hand-drawn woodgrain carries the texture, which lets every object on the shelves stay simple and easy to read.'),
        piece('visual-omdesigns-hallway', 'OMDesigns, coming soon', 'Original illustration', 'Illustration & lettering',
          'The launch announcement for OMDesigns: a hallway of lockers, banners, and a loading screen, with small in-jokes for anyone who looks twice.'),
        piece('visual-porch-swing', 'Porch swing', 'Original illustration', 'Illustration',
          'A perspective study with a watercolor sky. The warm wood and the cool wash do the work of setting a quiet mood, so the scene needs no figure in it.'),
      ],
    },
    {
      label: 'Lettering & identity',
      note: 'Letterforms carrying the idea, from a client mark to a hidden message.',
      pieces: [
        piece('sultry-hero', 'Sultry Tips', 'Logo & custom lettering', 'Logo design & lettering',
          'A mark for a Carrollton nail artist who ruled out brushes, drills, and paint. Hand-drawn letters inflated in Illustrator read as fresh polish instead. Still her logo two years on.'),
        piece('visual-breakfast-lettering', 'The most important part of the day', 'Illustration & hand lettering', 'Illustration & lettering',
          'A social piece for OMDesigns. Four lettering styles share one headline, and the message is hidden in the cereal bowl and the coffee.'),
      ],
    },
  ],
};
