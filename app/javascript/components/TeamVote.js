import React from "react"
import PropTypes from "prop-types"

import Card from './Card'
import Hand from './Hand'
import PokerTable from './PokerTable'
import TeamVoteChannel from '../channels/team_vote_channel'

class TeamVote extends React.Component {
  constructor(props) {
    super(props)

    this.channel = new TeamVoteChannel(props.teamID, this.handleChannelMsg, this.onSubscribe)

    this.state = {
      myCurrentVote: null,
      voteAverage: null,
      phase: 'voting',
      revealVotesAt: null,
      statistics: {
        average: null
      },
      participants: []
    }
  }

  onSubscribe = () => {
    this.channel.hello()
  }

  addParticipant = (id, firstName, lastName, vote) => {
    let currentParticipants = this.state.participants
    let userName = firstName

    // Check if participant already exists
    const userIndex = currentParticipants.findIndex(e => e.id === id)

    if (userIndex === -1) {
      const existingFirstName = currentParticipants.findIndex(e => e.name === userName)
      if (existingFirstName !== -1) {
        userName = `${firstName} ${lastName}`
      }

      currentParticipants.push({
        id: id,
        name: userName,
        vote: vote
      })
    } else {
      currentParticipants[userIndex] = {
        id: id,
        name: userName,
        vote: vote
      }
    }

    let myVote = this.state.myCurrentVote
    if (id === this.props.currentUserID) {
      myVote = vote
    }

    this.setState({
      participants: currentParticipants,
      myCurrentVote: myVote
    })
  }

  removeParticipant = (id) => {
    let currentParticipants = this.state.participants
    const userIndex = currentParticipants.findIndex(e => e.id === id)
    if (userIndex !== -1) {
      currentParticipants.splice(userIndex, 1)
      this.setState({
        participants: currentParticipants
      })
    }
  }

  sendVote = () => {
    const myUserID = this.state.participants.findIndex(e => e.id === 1)
    // this.setParticipantVote(myUserID, this.state.myCurrentVote)
    this.channel.vote(this.state.myCurrentVote)
  }

  setParticipantVote = (userID, vote) => {
    let updatedParticipants = this.state.participants
    const userIndex = updatedParticipants.findIndex(e => e.id === userID)
    updatedParticipants[userIndex] = {
      ...updatedParticipants[userIndex],
      vote: vote === null ? null : String(vote)
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
    this.channel.finalize()
  }

  handleNewVoteButton= () => {
    console.log("Handle New Vote")
    this.channel.new()
  }

  finalize = () => {
    const revealVotesAt = (Date.now() + 2000)
    this.setState({phase: 'locked', revealVotesAt: revealVotesAt}, () => {
      setTimeout(this.revealVotes, revealVotesAt - Date.now())
    })
  }

  newVote = () => {
    console.log("New Vote")
    let currentParticipants = this.state.participants.map(p => {
      p.vote = null
      return p
    })
    this.setState({phase: 'voting', myCurrentVote: null, participants: currentParticipants})
  }

  handleChannelMsg = (msg) => {
    if (Array.isArray(msg)) {
      msg.forEach((m, i) => {
        console.log(m)
        switch (m.action) {
          case 'participant_joined':
            let vote = m.data.participant_vote
            if (vote === null || vote === undefined || String(vote).length === 0) {
              vote = null
            }
            this.addParticipant(
              m.data.user_id,
              m.data.user_first_name,
              m.data.user_last_name,
              vote
            )
            break;
          case 'participant_left':
            this.removeParticipant(m.data.user_id)
            break;
          case 'vote':
            this.setParticipantVote(m.data.user_id, m.data.vote)
            break;
          case 'finalize':
            this.finalize()
            break;
          case 'new':
            this.newVote()
            break;
          default:
        }
      });
    }
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

  componentWillUnmount () {
    this.channel.unsubscribe()
  }
}

TeamVote.propTypes = {
  teamId: PropTypes.number
};
export default TeamVote
