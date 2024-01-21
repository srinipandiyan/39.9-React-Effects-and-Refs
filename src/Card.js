import "./Card.css";

/** Card component renders a single card within deck */
function Card({ name, image }) {
  return <img
      className="Card"
      alt={name}
      src={image}
    />;
}

export default Card;