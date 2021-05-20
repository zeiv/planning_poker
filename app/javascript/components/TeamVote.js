import React from "react"
import PropTypes from "prop-types"

import Card from './Card'
import Hand from './Hand'
import PokerTable from './PokerTable'

class TeamVote extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      myCurrentVote: null,
      voteAverage: null,
      phase: 'voting',
      revealVotesAt: null,
      statistics: {
        average: null
      },
      participants: this.cleanParticipants()
    }
  }

  cleanParticipants = () => {
    return [
      {
        id: 1,
        name: 'Xavier',
        vote: null
      },
      {
        id: 2,
        name: 'Test 1',
        vote: null
      },
      {
        id: 3,
        name: 'Test 2',
        vote: null
      },
      {
        id: 4,
        name: 'Test 3',
        vote: null
      },
      {
        id: 5,
        name: 'Test 4',
        vote: null
      },
      {
        id: 6,
        name: 'Test 5',
        vote: null
      }
    ]
  }

  sendVote = () => {
    let updatedParticipants = this.state.participants
    const myIndex = updatedParticipants.findIndex(e => e.id === 1)
    updatedParticipants[myIndex] = {
      ...updatedParticipants[myIndex],
      vote: this.state.myCurrentVote
    }
    this.setState({
      participants: updatedParticipants
    })
  }

  revealVotes = () => {
    const voters = this.state.participants.filter(e => e.vote !== null && parseInt(e.vote) !== 'NaN')
    const votes = voters.map(e => parseInt(e.vote))
    const voteAverage = votes.reduce((a, b) => (a + b)) / votes.length
    const newStatistics = {
      average: voteAverage
    }
    this.setState({statistics: newStatistics, phase: 'revealed'})
  }

  handleCardSelect = (cardValue) => {
    let newValue = cardValue
    if (this.state.myCurrentVote === newValue) {
      newValue = null
    }
    this.setState({myCurrentVote: newValue}, () => {
      this.sendVote()
    })
  }

  handleCountVoteButton = () => {
    const revealVotesAt = (Date.now() + 2000)
    this.setState({phase: 'locked', revealVotesAt: revealVotesAt}, () => {
      setTimeout(this.revealVotes, revealVotesAt - Date.now())
    })
  }

  handleNewVoteButton = () => {
    this.setState({phase: 'voting', myCurrentVote: null, participants: this.cleanParticipants()})
  }

  render () {
    return (
      <React.Fragment>
        <PokerTable
          participants={this.state.participants}
          phase={this.state.phase}
          onCountVote={this.handleCountVoteButton}
          onNewVote={this.handleNewVoteButton}
          countdownTo={this.state.revealVotesAt}
        ></PokerTable>
        <Hand
          selected={this.state.myCurrentVote}
          onSelect={this.handleCardSelect}
          phase={this.state.phase}
          statistics={this.state.statistics}
        ></Hand>
      </React.Fragment>
    );
  }
}

TeamVote.propTypes = {
  teamId: PropTypes.number
};
export default TeamVote
