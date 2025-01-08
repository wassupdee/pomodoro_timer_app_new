Rails.application.routes.draw do
  namespace :v1 do
    # 認証機能
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'v1/auth/registrations'
    }

    # ログインユーザー情報の取得
    namespace :auth do
      resources :sessions, only: %i[index]
    end
  end
end