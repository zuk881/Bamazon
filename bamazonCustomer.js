// variables to bring in mysql and requirer modules
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("\nconnected as id " + connection.threadId + "\n");
    afterConnection();
});

// function to display id , product name and price from mysql database
function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(" I.D. | Product     | Price");
        console.log("----------------------------");

        // loop through response to display all items in database
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + "     | " + res[i].product_name + " | " + res[i].price);
            console.log("----------------------------");
        }
        buyProduct();
    });
}

// function to get item and quantity from user
function buyProduct() {
    inquirer.prompt([
        {
            name: "item",
            type: "choice",
            message: "What is the I.D. of the product you would like to buy?",
            default: 1
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?",
            default: 5
        }
    ])
        .then(function (answer) {
            var query = "SELECT product_name, id, stock_quantity, price FROM products WHERE ?"
            connection.query(query, { id: answer.item }, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    var cost = res[i].price;
                    var name = res[i].product_name;
                    var currentQ = res[i].stock_quantity;
                }
                var quantityId = answer.quantity;

                // if statement to let user know if there is not enough stock on hand
                if (currentQ < quantityId) {
                    console.log("\nSorry, we do not have that quantity in stock");
                    console.log("\nWe only have " + currentQ + " left\n")
                    buyProduct();
                } else {
                    displayTotal(answer);
                }
            })
        })
}

// function to display item and total cost to user
function displayTotal(val) {
    var answer = val;
    var query = "SELECT product_name, id, stock_quantity, price FROM products WHERE ?"
    connection.query(query, { id: answer.item }, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var cost = res[i].price;
            var name = res[i].product_name;
            var currentQ = res[i].stock_quantity;
        }
        var quantityId = answer.quantity;
        var updateQ = currentQ - quantityId
        var idPrice = cost * quantityId;

        console.log("\nProduct: " + name);
        console.log("\nQuantity: " + quantityId);
        console.log("-------------------------")
        console.log("Your total price is: $" + idPrice);
        console.log("-------------------------")
        updateProduct(updateQ, answer);
    })
};

// function to update database to reflect new totals after sale
function updateProduct(val, answer) {
    var updateQ = val;
    var query = "UPDATE products SET ? WHERE ?"
    connection.query(query, [{ stock_quantity: updateQ }, { id: answer.item }], function (err, res) {
        if (err) throw err;
        connection.end();
    })
}


