document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);



async function loadDashboard() {

    try {

        const response =
            await fetch("/api/stock/dashboard");


        const result =
            await response.json();


        if (!result.success) {

            alert(result.message);

            return;

        }


        const data =
            result.data;



        document.getElementById("totalCategories").innerText =
            data.totalCategories;



        document.getElementById("totalProducts").innerText =
            data.totalProducts;



        document.getElementById("todaysEntries").innerText =
            data.todaysEntries;



        document.getElementById("currentStock").innerText =
            Number(data.currentStock).toLocaleString();



    }

    catch(error) {

        console.log(error);

        alert("Failed to load dashboard.");

    }

}