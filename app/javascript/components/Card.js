import React from "react"
import PropTypes from "prop-types"

class Card extends React.Component {
  constructor (props) {
    super(props)
  }

  handleClick = (value) => {
    if (!this.props.disabled && this.props.clickable && this.props.onSelect) {
      this.props.onSelect(value)
    }
  }

  render () {
    return (
      <div className={`card-wrapper${this.props.active ? ' active' : ''}${this.props.disabled ? ' disabled' : ''}`}>
        <div className={`card-container${this.props.faceDown ? ' face-down' : ''}${this.props.active ? ' active' : ''}${this.props.clickable ? ' clickable' : ''}${this.props.disabled ? ' disabled' : ''}${this.props.ghost ? ' ghost' : ''}${this.props.className ? ' ' + this.props.className : ''}`} onClick={() => this.handleClick(this.props.value)}>
          <div className="card-front">
            <h3>
              {this.props.value}
            </h3>
          </div>
          <div className="card-back"></div>
        </div>
        {this.props.label && (
          <h4 className="card-label">{this.props.label}</h4>
        )}
      </div>
    );
  }
}

Card.propTypes = {
  active: PropTypes.bool,
  clickable: PropTypes.bool,
  faceDown: PropTypes.bool,
  value: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  ghost: PropTypes.bool,
};
export default Card
