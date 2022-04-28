class Participant < ApplicationRecord
  belongs_to :team
  belongs_to :user

  enum status: {
    offline: 0,
    online: 1
  }
end
