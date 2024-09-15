class HomeController < ApplicationController
  def index
    @data = { "2023-01-01" => 10, "2023-02-01" => 15, "2023-03-01" => 20 }
  end
end
