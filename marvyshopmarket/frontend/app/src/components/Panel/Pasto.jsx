import PropTypes from 'prop-types';

// Matas de pasto y algunas flores sobre el suelo de las ilustraciones (y=132).
// `matas` son posiciones x; las flores van en `flores`. Colores en panel.css.
const Pasto = ({ matas, flores = [], suelo = 132 }) => (
  <g className="pasto-grupo">
    {matas.map((x, i) => (
      <path
        key={x}
        className={`pasto pasto__mata${i % 2 ? ' pasto--b' : ''}`}
        style={{ '--i': i }}
        d={`M${x} ${suelo}q1-7 -4-11q5 2 6 8q0-8 3-12q1 7-1 13q2-5 6-7q-3 4-3 9z`}
      />
    ))}
    {flores.map(([x, alto], i) => (
      <g key={`f${x}`} className="pasto__mata" style={{ '--i': i + 3 }}>
        <path className="pasto" d={`M${x - 0.6} ${suelo}h1.2v-${alto}h-1.2z`} />
        <circle className={`flor__petalo${i % 2 ? ' flor__petalo--b' : ''}`} cx={x} cy={suelo - alto} r="3.2" />
        <circle className="flor__centro" cx={x} cy={suelo - alto} r="1.3" />
      </g>
    ))}
  </g>
);

Pasto.propTypes = {
  matas: PropTypes.arrayOf(PropTypes.number).isRequired,
  flores: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  suelo: PropTypes.number,
};

export default Pasto;
