// This file handles API requests to communicate with the CRM platform

const apiUrl = 'https://your-crm-api-endpoint.com'; // Replace with your actual CRM API endpoint

// Function to submit the contact form data
async function submitContactForm(data) {
    try {
        const response = await fetch(`${apiUrl}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error submitting contact form:', error);
        throw error;
    }
}

// Export the function for use in other modules
export { submitContactForm };