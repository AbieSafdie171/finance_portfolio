class Property < ApplicationRecord
  belongs_to :user # Assuming you have a User model
  validates :property_address, :revenue, :operating_costs, presence: true
end
