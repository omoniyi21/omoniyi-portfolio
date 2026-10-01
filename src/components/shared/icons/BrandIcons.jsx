// Full-colour brand marks (Gil Barbara's logos, CC0), so the socials read as
// small accents of colour on the page. Kept as named exports for existing use.
import { BrandIcon } from "./Icon";

export const GithubIcon = ({ size = 18, ...props }) => <BrandIcon name="github" size={size} {...props} />;
export const PinterestIcon = ({ size = 18, ...props }) => <BrandIcon name="pinterest" size={size} {...props} />;
export const LinkedInIcon = ({ size = 18, ...props }) => <BrandIcon name="linkedin" size={size} {...props} />;
