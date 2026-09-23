// Visual & illustration archive. Earlier OMDesigns-era pieces, shown as supporting
// range for the studio rather than as full case studies.
const piece = (image, title, kind, role, body, extra = {}) => ({ image, title, kind, role, body, ...extra });

export const visualWork = {
  slug: 'visual',
  title: 'Drawn by hand, built for a brief.',
  summary:
    'Before product design had a name on my résumé, it was OMDesigns: illustration, hand lettering, and graphics for events and brands. That practice grew into Omoniyi Studio. These pieces show the visual side of the same designer: building a scene, setting type, and making a layout carry a mood.',
  groups: [
    {
      label: 'Scenes',
      note: 'Original illustration. Perspective, texture, and mood built from nothing.',
      pieces: [
        piece('visual-porch-swing', 'Porch swing', 'Original illustration', 'Illustration',
          'A perspective study with a watercolor sky. The warm wood and the cool wash do the work of setting a quiet mood, so the scene needs no figure in it.', { wide: true }),
        piece('visual-paneled-room', 'Paneled room', 'Original illustration', 'Illustration',
          'A flat, front-on interior where hand-drawn woodgrain carries the texture, which lets every object on the shelves stay simple and easy to read.'),
        piece('visual-omdesigns-hallway', 'OMDesigns, coming soon', 'Original illustration', 'Illustration & lettering',
          'The launch announcement for OMDesigns: a hallway of lockers, banners, and a loading screen, with small in-jokes for anyone who looks twice.'),
      ],
    },
    {
      label: 'Lettering',
      note: 'Illustration and type working as one message.',
      pieces: [
        piece('visual-breakfast-lettering', 'The most important part of the day', 'Illustration & hand lettering', 'Illustration & lettering',
          'A social piece for OMDesigns. Four lettering styles share one headline, and the message is hidden in the cereal bowl and the coffee.'),
      ],
    },
    {
      label: 'Event & brand graphics',
      note: 'Hierarchy and typography doing the heavy lifting.',
      pieces: [
        piece('visual-traitors-flyer', 'Traitors Game', 'Event flyer', 'Layout & typography',
          'A flyer for a party game night. One blade-like stroke through the title carries the concept, while tiled letters and a script tagline set the reading order.'),
        piece('visual-alexis-banner', 'Alexis Chantellé J', 'Creator brand header', 'Logo, typography & layout',
          'A header for a fashion, lifestyle, and beauty creator. The script wordmark, sparkle highlights, and pink-on-lavender palette were built around the illustration so the two read as one brand.',
          { credit: 'Illustration by a commissioned artist. Logo, typography, and layout by me.' }),
      ],
    },
  ],
};
