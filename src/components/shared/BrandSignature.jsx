import { Link } from 'react-router-dom';
import './ecosystem.css';

export default function BrandSignature({ space }) {
  return <div className={`ecosystem-signature ecosystem-signature--${space}`}>
    <Link className="ecosystem-wordmark" to="/" aria-label="Omoniyi homepage">omoniyi.</Link>
    <span className="ecosystem-divider" aria-hidden="true">/</span>
    <span className="ecosystem-space">{space === 'ui' ? 'UI' : space}</span>
  </div>;
}
