Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }

  devise_scope :user do
    unauthenticated do
      root 'devise/sessions#new', as: :unauthenticated_root
    end
    authenticated do
      root 'teams#index'
    end
  end

  resources :teams, path: ''
  # get ':id', to: 'teams#show', as: :team
end
