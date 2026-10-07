import useMotionReduced from "../../lib/useMotionReduced";

// A post's cover image. An animated cover loops; the footer's motion switch
// is the way to stop it. With motion reduced, by device setting or that
// switch, it shows the still frame instead.
export default function ObservationCover({ post, priority = false }) {
  const reduced = useMotionReduced();
  const src = reduced && post.cardImageStill ? post.cardImageStill : post.cardImage;
  return (
    <img
      src={src}
      alt={post.cardImageAlt || ""}
      width={post.cardImageWidth}
      height={post.cardImageHeight}
      {...(priority ? { fetchPriority: "high" } : { loading: "lazy" })}
    />
  );
}
