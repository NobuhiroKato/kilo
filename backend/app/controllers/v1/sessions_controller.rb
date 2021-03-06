module V1
  class SessionsController < ApplicationController
    skip_before_action :authenticate_user_from_token!, only: [:create]
    before_action :permission_check, only: [:roles]

    # POST /v1/login
    def create
      @user = User.find_for_database_authentication(email: params[:email])
      return invalid_email_or_email unless @user

      if @user.valid_password?(params[:password])
        if @user.access_token_expired?
          @user.update_access_token!
        end
        sign_in @user, store: false
        render json: @user, serializer: SessionSerializer
      else
        invalid_email_or_email
      end
    end

    # GET /v1/me
    def me
      render json: current_user, status: :ok
    end

    # GET /v1/roles
    def roles
      roles = Role.all
      render json: roles, status: :ok
    end

    private

    def invalid_email_or_email
      render json: { code: 'invalid_email_or_password' }, status: :bad_request
    end
  end
end
