require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

if Rails.env == 'development'
  require 'anycable-rack-server' if ENV['DISABLE_ANYCABLE_RPC'].blank? && defined?(::Rails::Server)
end

module PlanningPoker
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # ActionCable
    config.action_cable.allowed_request_origins = [%r{https?://\S+}]
    config.action_cable.url = ENV['ACTIONCABLE_URL']
  end
end
