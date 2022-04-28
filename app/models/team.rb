class Team < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  has_many :participants

  enum status: {
    voting: 0,
    finalized: 1
  }
end
