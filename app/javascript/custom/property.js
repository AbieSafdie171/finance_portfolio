// Function to initialize the modal and form logic
let initial = 0;
function updateTotalProfit() {
    let totalProfit = 0;
    
    // Get all rows in the table body
    const rows = document.querySelectorAll("#propertyTable tbody tr");

    rows.forEach((row) => {
        // Get the revenue and operating costs from the table
        const revenue = parseFloat(row.cells[1].innerText.replace('$', '')) || 0;
        const expenses = parseFloat(row.cells[2].innerText.replace('$', '')) || 0;

        // Calculate profit for each row and sum it up
        totalProfit += (revenue - expenses);
    });

    // Update the Total Profit span
    document.getElementById("total_profit_value").innerText = `$${totalProfit.toFixed(2)}`;
}


function initializeDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const propertyId = this.getAttribute('data-id');
            const row = this.closest('tr');

            console.log("ID: ", propertyId);
            
            if (confirm("Are you sure you want to delete this property?")) {
                fetch(`/properties/${propertyId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content")
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Remove the property row from the table
                        row.remove();
                        updateTotalProfit();
                    } else {
                        alert('Error deleting property');
                    }
                })
                .catch(error => {
                    console.error("Uh oh Error:", error);
                });
            }
        });
    });
}


function initializePropertyModal() {
    if (window.location.pathname === '/properties'){
        const modal = document.getElementById("propertyModal");
        const addPropertyButton = document.getElementById("addPropertyButton");
        const closeModal = document.getElementsByClassName("close")[0];

        // Open the modal
        addPropertyButton.onclick = function() {
            modal.style.display = "block";
        }

        // Close the modal
        closeModal.onclick = function() {
            modal.style.display = "none";
        }

        // Handle form submission and send data to Rails via AJAX
        const propertyForm = document.getElementById("propertyForm");
        propertyForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission

            // Gather form data
            const location = document.getElementById("location").value;
            const income = document.getElementById("revenue").value;
            const expenses = document.getElementById("expenses").value;

            // Send AJAX request to backend
            fetch("/properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content")
                },
                body: JSON.stringify({
                    property: {
                        property_address: location,
                        revenue: income,
                        operating_costs: expenses
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data);
                    // Add the new property to the table
                    const table = document.getElementById("propertyTable").getElementsByTagName('tbody')[0];
                    const newRow = table.insertRow();
                    var revenue = data.property.revenue;
                    var operating_costs = data.property.operating_costs;
                    console.log("IF: ", data.property.property_address);
                    newRow.insertCell(0).innerHTML = data.property.property_address;
                    newRow.insertCell(1).innerHTML = `$${revenue.toFixed(2)}`;
                    newRow.insertCell(2).innerHTML = `$${operating_costs.toFixed(2)}`;
                    newRow.insertCell(3).innerHTML = `<button class="edit-btn">Edit</button><button class="delete-btn" data-id="${data.property.id}">Delete</button>`;

                    // Clear the form and close the modal
                    propertyForm.reset();
                    modal.style.display = "none";
                    updateTotalProfit();
                    initializeDeleteButtons();
                    editPropertyModal()
                } else {
                    alert("Error: " + data.errors.join(", "));
                }
            })
            .catch(error => console.error("Uh oh Error:", error));
        });
    }
}


function editPropertyModal() {
    if (window.location.pathname === '/properties'){
        const modal = document.getElementById("editPropertyModal");
        const closeModal = document.getElementsByClassName("close")[1]; // Close button for edit modal
        const propertyForm = document.getElementById("editPropertyForm"); // The edit form
        const locationInput = document.getElementById("edit-location"); // Location input in the form
        const revenueInput = document.getElementById("edit-revenue"); // Revenue input in the form
        const expensesInput = document.getElementById("edit-expenses"); // Expenses input in the form

        let currentPropertyId = null; // Variable to track the property ID being edited

        // Close the modal
        closeModal.onclick = function() {
            modal.style.display = "none";
        }

        // Attach event listeners to each edit button
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get the property row associated with this button
                const row = this.closest('tr');
                currentPropertyId = this.nextElementSibling.getAttribute('data-id'); // Get the property ID from the Delete button

                const propertyAddress = row.cells[0].innerText;
                const revenue = parseFloat(row.cells[1].innerText.replace('$', ''));
                const operatingCosts = parseFloat(row.cells[2].innerText.replace('$', ''));

                // Populate the modal form with the property data
                locationInput.value = propertyAddress;
                revenueInput.value = revenue;
                expensesInput.value = operatingCosts;

                // Open the modal
                modal.style.display = "block";
            });
        });

        // Handle form submission for editing
        propertyForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from submitting the traditional way

            // Gather the updated property data from the form
            const updatedLocation = locationInput.value;
            const updatedRevenue = revenueInput.value;
            const updatedExpenses = expensesInput.value;

            // Send the AJAX PATCH request to update the property in the database
            fetch(`/properties/${currentPropertyId}`, {
                method: 'PATCH', // HTTP method for updating a resource
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content") // Include CSRF token
                },
                body: JSON.stringify({
                    property: {
                        property_address: updatedLocation,
                        revenue: updatedRevenue,
                        operating_costs: updatedExpenses
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the table row with the new data
                    const updatedRow = document.querySelector(`.delete-btn[data-id='${currentPropertyId}']`).closest('tr');
                    updatedRow.cells[0].innerText = updatedLocation;
                    updatedRow.cells[1].innerText = `$${parseFloat(updatedRevenue).toFixed(2)}`;
                    updatedRow.cells[2].innerText = `$${parseFloat(updatedExpenses).toFixed(2)}`;

                    // Close the modal
                    modal.style.display = "none";
                    updateTotalProfit(); // Recalculate the total profit after the update
                } else {
                    alert('Error updating property: ' + data.errors.join(', '));
                }
            })
            .catch(error => {
                console.error("Error updating property:", error);
            });
        });
    }
}









// Event listener for Turbo page loads
document.addEventListener('turbo:load', (event) => {
        initializePropertyModal();
        editPropertyModal()
        initializeDeleteButtons();
});
