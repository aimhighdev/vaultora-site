// countries.js

const countries = [
    {
        name: "United States",
        creditScoreRequirements: 650,
        loanFieldsConfig: {
            minLoanAmount: 5000,
            maxLoanAmount: 50000,
            interestRate: 5.0,
            loanTerm: 36
        }
    },
    {
        name: "Canada",
        creditScoreRequirements: 600,
        loanFieldsConfig: {
            minLoanAmount: 4000,
            maxLoanAmount: 40000,
            interestRate: 4.5,
            loanTerm: 48
        }
    },
    {
        name: "Germany",
        creditScoreRequirements: 700,
        loanFieldsConfig: {
            minLoanAmount: 6000,
            maxLoanAmount: 60000,
            interestRate: 3.5,
            loanTerm: 60
        }
    }
];

export default countries;