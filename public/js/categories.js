async function loadCategories() {

    const response = await fetch("/api/categories");
    const result = await response.json();

    let rows = "";

    result.data.forEach(category => {

        rows += `
        <tr>
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>
                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteCategory(${category.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    });

    document.getElementById("categoryTable").innerHTML = rows;
}

async function addCategory() {

    const name = document.getElementById("categoryName").value.trim();

    if (name === "") {
        alert("Category name is required.");
        return;
    }

    const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    });

    const result = await response.json();

    alert(result.message);

    if (result.success) {
        document.getElementById("categoryName").value = "";
        loadCategories();
    }
}

async function deleteCategory(id) {

    if (!confirm("Are you sure you want to delete this category?"))
        return;

    const response = await fetch("/api/categories/" + id, {
        method: "DELETE"
    });

    const result = await response.json();

    alert(result.message);

    if (result.success) {
        loadCategories();
    }
}

window.addEventListener("DOMContentLoaded", async () => {

    await initializeCommonUI();

    loadCategories();

});