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


function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(" I.D. | Product     | Department | Price | Stock Quantity");
        console.log("---------------------------------------------------------");

        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + "     | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + "   | " + res[i].stock_quantity)
            console.log("---------------------------------------------------------");
        }
        buyProduct();
    });
}

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
                var updateQ = currentQ - quantityId
                var idPrice = cost * quantityId;
                if (currentQ < quantityId) {
                    console.log("Sorry, we do not have that quantity in stock");
                    console.log("We only have " + currentQ + " left")
                    afterConnection();
                }
                
                console.log("Product: " + name);
                console.log("Quantity: " + quantityId);
                console.log("Your total price is: $" + idPrice);
                updateProduct(updateQ);
                connection.end();
            })

            
            
            function updateProduct(val) {
                var updateQ = val;
                var query = "UPDATE products SET ? WHERE ?"
                connection.query(query, [{ stock_quantity: updateQ }, { id: answer.item }], function (err, res) {
                    if (err) throw err;

                })
            }
        })
}
