class CreateProperties < ActiveRecord::Migration[7.2]
  def change
    create_table :properties do |t|
      t.integer :user_id
      t.string :property_address
      t.float :revenue
      t.float :operating_costs

      t.timestamps
    end
    add_index :properties, :user_id # Index to improve query performance on user_id
  end
end
