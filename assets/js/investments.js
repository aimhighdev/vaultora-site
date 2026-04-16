// investments.js

class Investment {
    constructor() {
        this.balance = 0;
        this.portfolio = {};
        this.transactionHistory = [];
    }

    deposit(amount) {
        this.balance += amount;
        this.recordTransaction('deposit', amount);
        this.updateFirebase();
    }

    withdraw(amount) {
        if (amount > this.balance) {
            console.log('Insufficient funds');
            return;
        }
        this.balance -= amount;
        this.recordTransaction('withdrawal', amount);
        this.updateFirebase();
    }

    purchaseInvestment(investmentId, amount) {
        if (amount > this.balance) {
            console.log('Insufficient funds for investment purchase');
            return;
        }
        if (!this.portfolio[investmentId]) {
            this.portfolio[investmentId] = 0;
        }
        this.portfolio[investmentId] += amount;
        this.balance -= amount;
        this.recordTransaction('purchase', amount);
        this.updateFirebase();
    }

    sellInvestment(investmentId, amount) {
        if (!this.portfolio[investmentId] || amount > this.portfolio[investmentId]) {
            console.log('Not enough investment to sell');
            return;
        }
        this.portfolio[investmentId] -= amount;
        this.balance += amount; // Assuming selling at face value
        this.recordTransaction('sell', amount);
        this.updateFirebase();
    }

    recordTransaction(type, amount) {
        const transaction = {
            type: type,
            amount: amount,
            date: new Date().toISOString()
        };
        this.transactionHistory.push(transaction);
    }

    updateFirebase() {
        // Logic to save data to Firebase
        const data = {
            balance: this.balance,
            portfolio: this.portfolio,
            transactionHistory: this.transactionHistory
        };
        // firebase.database().ref('investments').set(data);
    }

    getBalance() {
        return this.balance;
    }

    getPortfolio() {
        return this.portfolio;
    }

    getTransactionHistory() {
        return this.transactionHistory;
    }
}

// Real-time update logic would be implemented here to listen to Firebase changes

// Sample usage:
const myInvestment = new Investment();
myInvestment.deposit(1000);
myInvestment.purchaseInvestment('AAPL', 200);
myInvestment.withdraw(100);
myInvestment.sellInvestment('AAPL', 50);
console.log(myInvestment.getBalance(), myInvestment.getPortfolio());