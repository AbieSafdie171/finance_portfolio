class User < ApplicationRecord
  # Devise modules
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Remove email validation
  validates :username, presence: true, uniqueness: true
  validates :income, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :residence, presence: true

  # Override Devise's email validation (allow blank)
  def email_required?
    false
  end

  def email_changed?
    false
  end

  def will_save_change_to_email?
    false
  end
end
