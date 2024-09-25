console.log("hello");

document.addEventListener('turbo:load', (event) => {
    // Get the modal
    const modal = document.getElementById("propertyModal");

    // Get the button that opens the modal
    const addPropertyButton = document.getElementById("addPropertyButton");

    // Get the <span> element that closes the modal
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

    // Handle form submission and add data to table
    const propertyForm = document.getElementById("propertyForm");
    propertyForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        // Get form values
        const location = document.getElementById("location").value;
        const revenue = document.getElementById("revenue").value;
        const expenses = document.getElementById("expenses").value;

        // Add a new row to the table
        const table = document.getElementById("propertyTable").getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);

        cell1.innerHTML = location;
        cell2.innerHTML = '$' + revenue;
        cell3.innerHTML = '$' + expenses;
        cell4.innerHTML = '<button class="edit-btn">Edit</button>';

        // Clear form
        propertyForm.reset();

        // Close the modal
        modal.style.display = "none";
    });
});
