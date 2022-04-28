module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = env['warden']&.user(:user)
      reject_unauthorized_connection if current_user.blank?
    end

    def disconnect
      current_user.participants.online.each do |p|
        p.offline!
      end
    end
  end
end
