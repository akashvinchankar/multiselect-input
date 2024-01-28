import PropTypes from "prop-types";

const Pill = ({ image, text, onClick }) => {
  return (
    <span className="user-pill" onClick={onClick}>
      <img src={image} alt={text} />
      <span>{text} &times;</span>
    </span>
  );
};

Pill.propTypes = {
  image: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Pill;
