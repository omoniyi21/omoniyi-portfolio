
import starArt from "../../../assets/branding/celestial/celestial-star.png";
import stardust from "../../../assets/branding/celestial/stardust-asteroid.png";

// One coordinate space keeps every thread attached as the constellation drifts.
const nodes = [[90,12,90,'violet'],[77,20],[71,21],[62,14],[56,23,96,'peach'],[49,34],[41,50],[40,64],[38,79],[33,89],[22,89,85,'pearl'],[13,85],[7,73],[8,62],[13,52,90,'violet'],[20,50],[28,58],[62,30],[72,36],[88,39,92,'pink']];
const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[4,17],[17,18],[18,19],[2,19]];
const random = i => { const n = Math.sin(i * 127.1 + 31.7) * 43758.5453; return n - Math.floor(n); };
export default function HeroConstellation({ paused }) {
 return <div className="scorpio-scene">

  <svg className="scorpio-map" viewBox="0 0 700 560" aria-hidden="true">
   <g className="scorpio-orbit">
    {edges.map(([a,b])=><line key={`${a}-${b}`} x1={nodes[a][0]*6.5} y1={nodes[a][1]*4.7} x2={nodes[b][0]*6.5} y2={nodes[b][1]*4.7} />)}
    {nodes.map(([x,y,size,tone],i)=><g key={i} transform={`translate(${x*6.5} ${y*4.7})`}>
     {size ? <image href={starArt} x={-size/2} y={-size/2} width={size} height={size} className={`scorpio-star scorpio-star--${tone}`} style={{animationDelay:`${i*-.7}s`}} /> : <image href={starArt} x={-7} y={-7} width={14} height={14} className={`scorpio-star scorpio-star--${i%3===0 ? "pink" : "violet"}`} />}
    </g>)}
   </g>
   {Array.from({length:42},(_,i)=><path key={i} className="scorpio-spark" style={{animationDelay:`${i*-.43}s`}} transform={`translate(${random(i+200)*660} ${random(i+400)*490})`} d="M0 -4V4M-4 0H4" />)}
  </svg>
  <span className="scorpio-annotation" aria-hidden="true">always<br />connecting the dots.</span>
  <span className="scorpio-caption" aria-hidden="true">Scorpio</span>
  <a className="scorpio-companion" href="https://www.figma.com/design/ZdQgGWYa2JVXtn57IIMShQ/Stardust---Dust---Notebook-%E2%80%94-Theme-History---Foundations?m=auto&t=MvhnIWJv1SgQSHrF-6" target="_blank" rel="noreferrer" aria-label="Peek into Stardust theme history in Figma (opens in a new tab)">
   {Array.from({length:6},(_,i)=><i className={`asteroid-chip asteroid-chip--${i}`} key={i} aria-hidden="true"><img src={stardust} alt="" /></i>)}
   <img src={stardust} alt="Stardust, a cream asteroid with a knowing smile" /><span>peek into figma ↗</span>
  </a>
 </div>;
}
