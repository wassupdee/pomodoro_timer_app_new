Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  namespace :v1 do
    # 認証機能
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'v1/auth/registrations',
      confirmations: 'v1/auth/confirmations'
    }

    # ログインユーザー情報の取得
    namespace :auth do
      resources :sessions, only: %i[index]
    end

    post 'timer_records', to: 'timer_records#create_or_update'
    resources :timer_records, only: %i[index]
  end

  # ルートパスを設定し、デプロイ時にエラーが起きるのを防ぐ
  get "/", to: proc { [200, {}, ["API is running 🚀"]] }
end