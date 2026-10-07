import useMotionReduced from "../../lib/useMotionReduced";

// A post's cover image. An animated cover plays once and settles on its last
// frame (under five seconds, so it needs no pause control). With motion
// reduced, by device setting or the on-site switch, it shows the still frame.
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
