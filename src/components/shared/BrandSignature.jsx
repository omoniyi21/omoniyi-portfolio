import { Link } from 'react-router-dom';
import { BrandMark } from './BrandMarks';
import './ecosystem.css';

const HOME = { portfolio: '/', studio: '/studio', ui: '/uikit' };
const LABEL = { portfolio: 'Omoniyi Alimi, portfolio home', studio: 'Omoniyi Studio home', ui: 'Omoniyi UI home' };

// Each space's header lockup is its own practice mark from the brand sheet.
export default function BrandSignature({ space }) {
  return <div className={`ecosystem-signature ecosystem-signature--${space}`}>
    <Link className="ecosystem-wordmark" to={HOME[space] || '/'} aria-label={LABEL[space] || LABEL.portfolio}>
      <BrandMark space={space} />
    </Link>
  </div>;
}
