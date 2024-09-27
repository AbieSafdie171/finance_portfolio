// Function to initialize the modal and form logic
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

            console.log(location, income, expenses);

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
                    newRow.insertCell(3).innerHTML = '<button class="edit-btn">Edit</button>';

                    // Clear the form and close the modal
                    propertyForm.reset();
                    modal.style.display = "none";
                } else {
                    alert("Error: " + data.errors.join(", "));
                }
            })
            .catch(error => console.error("Uh oh Error:", error));
        });
    }
}

// Event listener for the initial page load
document.addEventListener('DOMContentLoaded', (event) => {
    initializePropertyModal();
});

// Event listener for Turbo page loads
document.addEventListener('turbo:load', (event) => {
    initializePropertyModal();
});
