class PropertiesController < ApplicationController
  before_action :authenticate_user! # Ensure user is signed in

  def index
    @properties = Property.all # Fetch all properties
    render 'properties/properties' # Render the same view for index
  end

  def create
    @property = Property.new(property_params)
    @property.user_id = current_user.id # Associate property with the current user

    if @property.save
      render json: { success: true, property: @property }, status: :created
    else
      render json: { success: false, errors: @property.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def property_params
    params.require(:property).permit(:property_address, :revenue, :operating_costs)
  end
end
