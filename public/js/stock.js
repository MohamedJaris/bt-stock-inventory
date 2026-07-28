let products = [];
let sizes = [];

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("entryDate").value = new Date()
    .toISOString()
    .split("T")[0];

  await loadCategories();
});

document.getElementById("category").addEventListener("change", loadStockData);

/* -----------------------------
   Load Categories
------------------------------ */

async function loadCategories() {
  const response = await fetch("/api/categories");

  const result = await response.json();

  const dropdown = document.getElementById("category");

  dropdown.innerHTML = "";

  result.data.forEach((category) => {
    dropdown.innerHTML += `

            <option value="${category.id}">
                ${category.name}
            </option>

        `;
  });

  if (result.data.length > 0) {
    await loadStockData();
  }
}

/* -----------------------------
   Load Products + Sizes
------------------------------ */

async function loadStockData() {
  const categoryId = document.getElementById("category").value;

  const response = await fetch("/api/stock/category/" + categoryId);

  const result = await response.json();

  products = result.products;
  sizes = result.sizes;

  buildStockTable();
}

/* -----------------------------
   Build Entire Table
------------------------------ */

function buildStockTable() {
  buildHeader();

  buildBody();
}

/* -----------------------------
   Table Header
------------------------------ */

function buildHeader() {
  const thead = document.getElementById("tableHead");

  let html = `

        <tr>

            <th style="min-width:200px">
                Product
            </th>

    `;

  sizes.forEach((size) => {
    html += `

            <th>

                ${size.sizeName}

            </th>

        `;
  });

  html += `

        </tr>

    `;

  thead.innerHTML = html;
}

/* -----------------------------
   Table Body
------------------------------ */

function buildBody() {
  const tbody = document.getElementById("tableBody");

  tbody.innerHTML = "";

  products.forEach((product) => {
    tbody.appendChild(buildProductRow(product));
  });
}

/* -----------------------------
   Single Product Row
------------------------------ */

function buildProductRow(product) {
  const row = document.createElement("tr");

  row.dataset.productId = product.id;

  let html = `

        <td class="text-start fw-semibold">

            ${product.name}

        </td>

    `;

  sizes.forEach((size) => {
    const assigned = product.sizes.some((s) => s.id === size.id);

    if (assigned) {
      html += `

                <td>

                    <input
                        type="number"
                        min="0"
                        class="form-control form-control-sm stock-input"

                        data-product="${product.id}"

                        data-size="${size.id}"

                        placeholder="0">

                </td>

            `;
    } else {
      html += `

                <td class="bg-light text-muted">

                    —

                </td>

            `;
    }
  });

  row.innerHTML = html;

  return row;
}

async function saveStock() {
  const entryDate = document.getElementById("entryDate").value;

  const categoryId = Number(document.getElementById("category").value);

  const remarks = document.getElementById("remarks").value.trim();

  if (!entryDate) {
    alert("Please select an entry date.");

    return;
  }

  const items = [];

  document.querySelectorAll(".stock-input").forEach((input) => {
    const value = input.value.trim();

if (value === "") {
    return;
}

const quantity = Number(value);

if (isNaN(quantity) || quantity < 0) {
    return;
}

    items.push({
      productId: Number(input.dataset.product),

      sizeId: Number(input.dataset.size),

      quantity: quantity,
    });
  });

  if (items.length === 0) {
    alert("Please enter stock for at least one size.");

    return;
  }

  try {
    const response = await fetch("/api/stock", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        entryDate,

        categoryId,

        remarks,

        items,
      }),
    });

    const result = await response.json();

    alert(result.message);

    if (result.success) {
      resetForm();
    }
  } catch (error) {
    console.error(error);

    alert("Failed to save stock.");
  }
}

function resetForm() {
  document.getElementById("remarks").value = "";

  document.querySelectorAll(".stock-input").forEach((input) => {
    input.value = "";
  });
}

function getProduct(productId) {
  return products.find((p) => p.id === productId);
}

function getSize(sizeId) {
  return sizes.find((s) => s.id === sizeId);
}
