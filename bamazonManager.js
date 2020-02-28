// variables to bring in mysql and inquirer modules
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

});

// functiont to start the app and ask user what action they want to preform
function startApp() {
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            message: "What would you like to do?",
            choices: ["", "View products for sale", "View low inventory", "Add to inventory", "Add new product", "Exit"]
        }
    ])
        .then(function (answer) {

            // falsy value check in case choice is undefined
            if (answer.choice) {
                answer.choice = answer.choice;
                // do something else
            } else {
                console.log("\nMaybe another time");
            }

            // switch statement to route user to proper function
            var action = answer.choice
            switch (action) {
                case "View products for sale":
                    viewProd();
                    break;

                case "View low inventory":
                    lowInv()
                    break;

                case "Add to inventory":
                    addInv();
                    break;

                case "Add new product":
                    addProd();
                    break;

                case "Exit":
                    exit();
                    break;
            }
        });
}

// view products function ==================================================

// function to display products in database
function viewProd() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(" I.D. | Product     | Price | Quantity in stock");
        console.log("------------------------------------------------");

        for (var i = 0; i < res.length; i++) {
            console.log(" " + res[i].id + "     | " + res[i].product_name + " | " + res[i].price + "    | " + res[i].stock_quantity);
            console.log("------------------------------------------------");
        }
        startApp();
    })
}

// =========================================================================

// low inventory function ==================================================

// function to display all items in database with a stock quantity lower than 5
function lowInv() {
    connection.query("SELECT product_name, id, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log(" I.D. | Product     | Quantity in stock");
        console.log("------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("  " + res[i].id + "   | " + res[i].product_name + " | " + res[i].stock_quantity);
            console.log("------------------------------------------------");
        }
      
        startApp();
    })
}

// =========================================================================

// add inventory function ==================================================

// function to add inventory amounts to any existing product
function addInv() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(" I.D. | Product     | Stock Quantity");
        console.log("------------------------------------");

        for (var i = 0; i < res.length; i++) {
            console.log(" " + res[i].id + "     | " + res[i].product_name + " | " + res[i].stock_quantity);
            console.log("------------------------------------");
        }
        addProduct();
    });
}

// function to ask which product they want to add inventory to and how much
function addProduct() {
    inquirer.prompt([
        {
            name: "item",
            type: "choice",
            message: "What is the I.D. of the product you would like to add?",
            default: 1
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to add?",
            default: 5
        }
    ])
        .then(function (answer) {
            var query = "SELECT product_name, id, stock_quantity FROM products WHERE ?"
            connection.query(query, { id: answer.item }, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    var currentQ = res[i].stock_quantity;
                }
                var quantityId = answer.quantity;
                var updateQ = parseInt(currentQ) + parseInt(quantityId);
                updateProduct(updateQ, answer);
            })
        })
}

// function that updates the appropriate item
function updateProduct(val, answer) {
    var updateQ = val;
    var query = "UPDATE products SET ? WHERE ?"
    connection.query(query, [{ stock_quantity: updateQ }, { id: answer.item }], function (err, res) {
        if (err) throw err;

        displayNewStock(updateQ, answer);
    })
}

// function to display what item and how much was sucessfully updated
function displayNewStock(val, answer) {
    var updateQ = val;
    var query = "SELECT product_name, id, stock_quantity FROM products WHERE ?"
    connection.query(query, { id: answer.item }, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var quantityId = answer.quantity;
            var name = res[i].product_name;
        }

        console.log("\nProduct: " + name);
        console.log("\nAdd to stock: " + quantityId);
        console.log("-------------------------")
        console.log("Your new total stock is: " + updateQ);
        console.log("-------------------------")
        startApp();

    })
}

// =========================================================================

// add product function ====================================================

// function to add new products to database
function addProd() {
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "What is the name of the new product you want to add?"
        },
        {
            name: "department",
            type: "input",
            message: "What department is new product in?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price?"
        },
        {
            name: "stock",
            type: "input",
            message: "How much stock are you adding?"
        }

    ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.item,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err) {
                    if (err) throw err;
                    console.log("\nYour item was added successfully!\n")
                    startApp();
                }
            );
        });
}

// ========================================================================

// exit function ==========================================================

// function to end application when user chooses to end session
function exit() {
    connection.end();
}

// ========================================================================

// function call to start app the 1st time
startApp();


