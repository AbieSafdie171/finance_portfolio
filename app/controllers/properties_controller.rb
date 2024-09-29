class PropertiesController < ApplicationController
  before_action :authenticate_user! # Ensure user is signed in
  before_action :set_property, only: [:destroy, :update]

  def index
    @properties = Property.all # Fetch all properties
    @user_properties = current_user.properties
    render 'properties/properties' # Render the same view for index
  end

  def update
    if @property.update(property_params)
      render json: { success: true, property: @property }
    else
      render json: { success: false, errors: @property.errors.full_messages }, status: :unprocessable_entity
    end
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

  def destroy
    if @property.destroy
      head :no_content
    else
      render json: { success: false, errors: "Failed to delete property" }, status: :unprocessable_entity
    end
  end

  private


  def set_property
    @property = Property.find(params[:id])
  end

  def property_params
    params.require(:property).permit(:property_address, :revenue, :operating_costs)
  end
end
