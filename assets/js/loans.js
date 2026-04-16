// loans.js

// Function to validate loan form
function validateLoanForm(form) {
    // Basic validation for required fields
    let isValid = true;
    const requiredFields = ['name', 'email', 'loanType', 'amount'];

    requiredFields.forEach(field => {
        if (!form[field]) {
            isValid = false;
            alert(`${field} is required`);
        }
    });

    // Country-aware validation
    if (form.country === 'USA' && form.state === '') {
        isValid = false;
        alert('State is required for USA applicants');
    }

    // Conditional display of credit score
    if (form.loanType === 'personal' && !form.creditScore) {
        isValid = false;
        alert('Credit Score is required for personal loans');
    }

    // Debt-to-income calculation
    if (form.income && form.debts) {
        const dti = (form.debts / form.income) * 100;
        if (dti > 43) {
            isValid = false;
            alert('Debt-to-Income ratio exceeds 43%');
        }
    }

    // Loan amount validation
    if (form.amount < 1000 || form.amount > 500000) {
        isValid = false;
        alert('Loan amount must be between $1,000 and $500,000');
    }

    // Credit history checks
    if (form.creditHistory && form.creditHistory < 3) {
        isValid = false;
        alert('Minimum 3 years of credit history required');
    }

    return isValid;
}

// Dynamic form population based on loan type
function updateFormBasedOnLoanType(loanType) {
    const creditScoreField = document.getElementById('creditScore');
    if (loanType === 'personal') {
        creditScoreField.style.display = 'block';
    } else {
        creditScoreField.style.display = 'none';
    }
}

// Handling submission to Firebase
async function submitToFirebase(form) {
    const db = firebase.firestore();
    try {
        await db.collection('loans').add(form);
        alert('Loan application submitted successfully!');
    } catch (error) {
        console.error('Error submitting loan application:', error);
        alert('There was a problem submitting your application. Please try again.');
    }
}

// Example of form handling
document.getElementById('loanForm').addEventListener('submit', (event) => {
    event.preventDefault();  // Prevent default form submission
    const form = Object.fromEntries(new FormData(event.target));
    if (validateLoanForm(form)) {
        submitToFirebase(form);
    }
});