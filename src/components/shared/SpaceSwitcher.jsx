import { SpaceLink } from './SpaceTransition';
import './ecosystem.css';

const spaces = [['portfolio', 'Portfolio', '/'], ['studio', 'Studio', '/studio'], ['ui', 'UI Kits', '/uikit']];
export default function SpaceSwitcher({ space, onNavigate }) {
  return <div className="ecosystem-switcher" role="group" aria-label="Omoniyi spaces">
    {spaces.map(([id, label, to], index) => <span key={id}>
      {index > 0 && <span className="ecosystem-dot" aria-hidden="true">·</span>}
      <SpaceLink to={to} tone={id} onClick={onNavigate} aria-current={id === space ? 'true' : undefined}>{label}</SpaceLink>
    </span>)}
  </div>;
}
