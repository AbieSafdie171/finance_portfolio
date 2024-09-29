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

        // Close modal if user clicks outside of it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
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
                    console.log("IF: ", data.property.property_address);
                    newRow.insertCell(0).innerHTML = data.property.property_address;
                    newRow.insertCell(1).innerHTML = '$' + data.property.revenue;
                    newRow.insertCell(2).innerHTML = '$' + data.property.operating_costs;
                    newRow.insertCell(3).innerHTML = `<button class="edit-btn">Edit</button><button class="delete-btn" data-id="${data.property.id}">Delete</button>`;

                    // Clear the form and close the modal
                    propertyForm.reset();
                    modal.style.display = "none";
                    updateTotalProfit();
                    initializeDeleteButtons();
                } else {
                    alert("Error: " + data.errors.join(", "));
                }
            })
            .catch(error => console.error("Uh oh Error:", error));
        });
    }
}


// Having an issue where delete button wont work after updating
    // maybe init delete button first always
    // figure the diff between dom and turbo for this context
    // 


// Event listener for the initial page load
/*
document.addEventListener('DOMContentLoaded', (event) => {
    if (initial == 0){
        initializePropertyModal();
        initializeDeleteButtons();
        initial = 1;
    }
    
});
*/

// Event listener for Turbo page loads
document.addEventListener('turbo:load', (event) => {
        initializePropertyModal();
        initializeDeleteButtons();
});
