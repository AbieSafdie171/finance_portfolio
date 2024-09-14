class Users::RegistrationsController < Devise::RegistrationsController
  private

  def sign_up_params
    params.require(:user).permit(:username, :password, :password_confirmation, :income, :residence)
  end

  def account_update_params
    params.require(:user).permit(:username, :password, :password_confirmation, :current_password, :income, :residence)
  end
end
