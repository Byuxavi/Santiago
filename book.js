document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("bookingForm").addEventListener("submit", function (event) {
        let email = document.getElementById("email").value;
        let phone = document.getElementById("phone").value;
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let phonePattern = /^[0-9]{10}$/; // Assumes 10-digit phone number

        // Validate email
        if (!email.match(emailPattern)) {
            alert("Please enter a valid email address.");
            event.preventDefault();
            return;
        }

        // Validate phone
        if (!phone.match(phonePattern)) {
            alert("Please enter a valid phone number (10 digits).");
            event.preventDefault();
            return;
        }

        // Success message
        alert("Your request has been submitted successfully!");
    });
});
