import React from "react"
import PropTypes from "prop-types"

import Countdown from 'react-countdown'

import Card from './Card'

class PokerTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.stateFromProps(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.stateFromProps(nextProps))
  }

  stateFromProps = (props) => {
    let updatedCards = props.participants.map((participant) => {
      return(
        <Card
          key={participant.id}
          label={participant.name}
          value={participant.vote}
          faceDown={props.phase !== 'revealed'}
          ghost={participant.vote === null}
        ></Card>
      )
    })

    return({
      cards: updatedCards
    })
  }

  cardsForTop = () => {
    return this.state.cards.filter((_card, index) => {
      return(index === 1 || index % 2 !== 0 && !(index % 4 === 0 || (index - 1) % 4 === 0))
    })
  }

  cardsForBottom = () => {
    return this.state.cards.filter((_card, index) => {
      return(index === 0 || index % 2 === 0 && !(index % 4 === 0 || (index - 1) % 4 === 0))
    })
  }

  cardsForLeft = () => {
    return this.state.cards.filter((_card, index) => {
      return(index % 4 === 0 && index !== 0)
    })
  }

  cardsForRight = () => {
    return this.state.cards.filter((_card, index) => {
      return(index !== 1 && (index - 1) % 4 === 0  && index !== 0)
    })
  }

  contentForTable = () => {
    switch (this.props.phase) {
      case 'voting':
        return this.tableVotingContent()
      case 'locked':
        return this.tableLockedContent()
      case 'revealed':
        return this.tableRevealedContent()
    }
  }

  tableVotingContent = () => {
    const anyVote = this.props.participants.find(e => e.vote !== null)
    if (anyVote) {
      return(
        <button className="btn btn-primary" onClick={this.props.onCountVote}>
          Reveal Cards
        </button>
      )
    } else {
      return(
        <p>Please pick your cards!</p>
      )
    }
  }

  tableLockedContent = () => {
    const countdownRenderer = (props) => {
      return(
        <p className="fs-4 text-muted">{props.seconds}</p>
      )
    }
    return(
      <Countdown
        date={this.props.countdownTo}
        renderer={countdownRenderer}
      ></Countdown>
    )
  }

  tableRevealedContent = () => {
    return(
      <button className="btn btn-secondary" onClick={this.props.onNewVote}>
        Start New Vote
      </button>
    )
  }

  render () {
    return (
      <div className="poker-table-wrapper">
        <div className="poker-table-container">
          {/* Top third of grid */}
          <div></div> {/* Empty corner */}
          <div className="poker-chairs poker-chairs-top">{this.cardsForTop()}</div>
          <div></div> {/* Empty corner */}
          {/* Middle third of grid */}
          <div className="poker-chairs poker-chairs-left">{this.cardsForLeft()}</div>
          <div className="poker-table grid-table">{this.contentForTable()}</div>
          <div className="poker-chairs poker-chairs-right">{this.cardsForRight()}</div>
          {/* Bottom third of grid */}
          <div></div> {/* Empty Corner */}
          <div className="poker-chairs poker-chairs-bottom">{this.cardsForBottom()}</div>
        </div>
      </div>
    );
  }
}

PokerTable.propTypes = {
  participants: PropTypes.arrayOf(PropTypes.object),
  onNewVote: PropTypes.func,
  onCountVote: PropTypes.func,
  phase: PropTypes.oneOf(['voting','locked','revealed']),
  lockedTimerValue: PropTypes.number,
  countdownTo: PropTypes.number
};
export default PokerTable
