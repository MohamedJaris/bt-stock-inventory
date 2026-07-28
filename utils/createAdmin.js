const bcrypt = require("bcrypt");
const { Admin } = require("../models");

async function createDefaultAdmin() {

    const exists = await Admin.findOne({
        where: {
            username: "admin"
        }
    });

    if (exists) {
        return;
    }

    const password = await bcrypt.hash("admin123", 10);

    await Admin.create({

        username: "admin",

        password,

        role: "ADMIN"

    });

    console.log("=================================");
    console.log(" Default Admin Created");
    console.log(" Username : admin");
    console.log(" Password : admin123");
    console.log("=================================");

}

module.exports = createDefaultAdmin;