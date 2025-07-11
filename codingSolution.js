// Observation 1 (if condition -> (a) $1,000 plus (b) the Contingent Interest Payment)
// if the return is more than threshold then my money is safe, and it'll return my money as principal + interest rate, irrespective of Underlying Return

// Observation 2 (else condition -> $1000 + [$1000 × (Underlying Return + Buffer Amount)%])
// and if the return is less than threshold then my buffer amount will save some of my money from loss, like even if I lose 100% of my money, just because I already have some buffer amount I'll get back the buffer amount.
// so now if I lose 30% (it's more loss than the threshold of 10%) so I'll lose money, but as the instructions said, my buffer amount will cover up some of my loss, here 30% - 10% = 20%, so I'll not lose 30% of money, rather I'll lose 20% of the money

function generateMaturityTable(){
    const principal = 1000;
    const interestRateYear = 12.20;
    const interestRateMonth = (interestRateYear / 12);
    const threshold = -10;
    const buffer = 10;

    const returns = [60.00, 40.00, 20.00, 5.00, 0.00, -5.00, -10.00, -10.01, -20.00, -30.00, -40.00, -60.00, -80.00, -100, -110, -110.1, -200.00];

    console.log("Underlying Return | Payment at Maturity");
    console.log("---------------------------------------");

    returns.forEach((ret) => {
        let payment;
        // observation 1
        if(ret >= threshold){
            payment =  principal + (principal * interestRateMonth / 100);
        }else{
            // observation 2
            let haveToPayPercent = ret + buffer;
            let haveToPay = (principal * haveToPayPercent) / 100;
            payment = principal + haveToPay;
            if(payment < 0){
                console.warn("Payment at Maturity cannot be negative, so I set the payment to 0");
                payment = 0;
            }
        }
        console.log(`${ret}%               |  $${payment.toFixed(4)}`);
    })
}

generateMaturityTable();

/*
Bonus 1: By running this code you'll get the desired output like the example table, and I wrote the code based on observation 1 and 2 on top of the code, and implemented it in if-else condition.

Bonus 2: In the frontend live URL and code, I implemented the output in docs format and also in downloadable format.

Bonus 3: 
a) In that frontend, the errors like "Payment at Maturity cannot be negative" will show up, so user can see it clearly. Till Underlying Return of -110% the Payment at Maturity will not be in negative, but beyound -110% Payment at Maturity will become a negative number. So I set the payment to 0.

b) The principal amount can't be in negative, so in that frontend you'll not be able to input negative principal amount.
*/


/*
Bonus 4: User can Download the output in 4 different ways – CSV, JSON, DOCX, PDF.

Bonus 5: Made the frontend, so user can give dynamic input, anyone can calculate Payment at Maturity by providing input in that frontend and visualize it in a well documented good format.
*/

// frontend live URL -> https://maturity-calculator-by-trishit.vercel.app
// frontend code Github -> https://github.com/trishitchar/MaturityCalculator