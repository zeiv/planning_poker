import React from "react"
import PropTypes from "prop-types"

import Card from './Card'

class Hand extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cardOptions: [
        '0',
        '1',
        '2',
        '3',
        '5',
        '8',
        '13',
        '21',
        '34',
        '55',
        '89',
        '?'
      ]
    }
  }

  doSelect = (value) => {
    if (this.props.onSelect) {
      this.props.onSelect(value)
    }
  }

  render () {
    const cards = this.state.cardOptions.map((val) => {
      return(
        <Card
          key={val}
          value={val}
          clickable
          disabled={this.props.phase === 'locked'}
          active={val === this.props.selected}
          onSelect={() => this.doSelect(val)}
        ></Card>
      )
    })

    return (
      <div className="hand-container">
        {this.props.phase !== 'revealed' &&
          <div className="hand">
            {cards}
          </div>
        }
        {this.props.phase === 'revealed' &&
          <div className="vote-statistics">
            <p className="fs-4">Average: {this.props.statistics.average ? this.props.statistics.average.toFixed(1) : 'None'}</p>
          </div>
        }
      </div>
    );
  }
}

Hand.propTypes = {
  onSelect: PropTypes.func,
  selected: PropTypes.string,
  phase: PropTypes.string,
  statistics: PropTypes.object
};
export default Hand
