class TeamVoteChannel < ApplicationCable::Channel
  state_attr_accessor :team
  state_attr_accessor :participant

  def subscribed
    self.team = Team.find(params['team_id'])
    self.participant = Participant.find_or_create_by(team_id: team.id, user_id: current_user.id)

    stream_for team
    stream_for participant

    participant.online!
  end

  def unsubscribed
    participant.offline!
    self.class.broadcast_to(team, [{
      action: 'participant_left',
      data: {
        user_id: current_user&.id
      }
    }])
  end

  # Client notifies us they have received subscription confirmation
  def hello
    notify_participant_joined
    send_welcome_package
  end

  def vote(data)
    # Create vote record
    participant.update(vote: data['value'])

    self.class.broadcast_to(team, [{
      action: 'vote',
      data: {
        user_id: current_user&.id,
        vote: data['value']
      }
    }])
  end

  def finalize
    team.finalized!

    self.class.broadcast_to(team, [{
      action: 'finalize'
    }])
  end

  def new
    team.voting!
    team.participants.update_all(vote: nil)

    self.class.broadcast_to(team, [{
      action: 'new'
    }])
  end

  private

  def send_welcome_package
    current_participants = team.participants.online
    payload = current_participants.map do |p|
      {
        action: 'participant_joined',
        data: {
          user_id: p.user.id,
          user_first_name: p.user.first_name,
          user_last_name: p.user.last_name,
          participant_vote: p.vote
        }
      }
    end

    self.class.broadcast_to(team, payload)
  end

  def notify_participant_joined
    self.class.broadcast_to(team, [{
      action: 'participant_joined',
      data: {
        user_id: current_user&.id,
        user_first_name: current_user&.first_name,
        user_last_name: current_user&.last_name,
        participant_vote: participant.vote
      }
    }])
  end
end
