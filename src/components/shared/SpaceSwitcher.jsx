import { SpaceLink } from './SpaceTransition';
import { Icon } from './icons/Icon';
import { PERSONAL_ORIGIN, isStudioHost } from '../../lib/siteHost';
import './ecosystem.css';

// Each space gets its own small mark: a stack of papers for the
// portfolio, a ticket for Studio, a phone for the UI kits.
const spaces = [['portfolio', 'Portfolio', '/', 'professional'], ['studio', 'Studio', '/studio', 'studio'], ['ui', 'UI Kits', '/uikit', 'uikit']];
export default function SpaceSwitcher({ space, onNavigate }) {
  return <div className="ecosystem-switcher" role="group" aria-label="Omoniyi spaces">
    {spaces.map(([id, label, to, icon], index) => <span key={id}>
      {index > 0 && <span className="ecosystem-dot" aria-hidden="true">·</span>}
      {isStudioHost() && id !== 'studio'
        // On the Studio domain, "/" is Studio, so the other spaces link to the portfolio's domain.
        ? <a href={PERSONAL_ORIGIN + to} onClick={onNavigate}>
          <Icon name={icon} size={15} className="ecosystem-switcher__icon" />
          <span className="ecosystem-switcher__label">{label}</span>
        </a>
        : <SpaceLink to={to} tone={id} onClick={onNavigate} aria-current={id === space ? 'true' : undefined}>
          <Icon name={icon} size={15} className="ecosystem-switcher__icon" />
          <span className="ecosystem-switcher__label">{label}</span>
        </SpaceLink>}
    </span>)}
  </div>;
}
