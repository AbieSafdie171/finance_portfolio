class AddUsernameIncomeResidenceToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :username, :string
    add_column :users, :income, :integer
    add_column :users, :residence, :string
    
    # Optionally, you can add an index to username if you want it to be unique
    add_index :users, :username, unique: true
  end
end
