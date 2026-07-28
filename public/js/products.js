let allProducts = [];
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
    createDefaultSizeFields();

    loadProducts();
  }
}

function createDefaultSizeFields() {
  const container = document.getElementById("sizeList");

  container.innerHTML = "";

  addSizeField();
  addSizeField();
  addSizeField();
}

function addSizeField() {
  const container = document.getElementById("sizeList");

  const div = document.createElement("div");

  div.className = "input-group mb-2";

  div.innerHTML = `

        <input 
        type="text"
        class="form-control size-input"
        placeholder="Enter size">


        <button
        class="btn btn-danger"
        onclick="this.parentElement.remove()">

        X

        </button>

    `;

  container.appendChild(div);
}

async function loadProducts() {
  const categoryId = document.getElementById("category").value;

  const response = await fetch("/api/products/category/" + categoryId);

  const result = await response.json();

  let rows = "";

  allProducts = result.data;

  allProducts.forEach(product => {
    rows += `

        <tr>

        <td>${product.id}</td>

        <td>${product.name}</td>


        <td>

        <button
        class="btn btn-danger btn-sm"
        onclick="deleteProduct(${product.id})">

        Delete

        </button>


        </td>


        </tr>


        `;
  });

  document.getElementById("productTable").innerHTML = rows;
}

async function addProduct() {
  const categoryId = document.getElementById("category").value;

  const name = document.getElementById("productName").value.trim();

  const sizes = [...document.querySelectorAll(".size-input")]
    .map((input) => input.value.trim())
    .filter((size) => size != "");

  if (name == "") {
    alert("Product name required");

    return;
  }

  if (sizes.length == 0) {
    alert("Add at least one size");

    return;
  }

  const response = await fetch("/api/products", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      categoryId,
      name,
      sizes,
    }),
  });

  const result = await response.json();

  alert(result.message);

  if (result.success) {
    document.getElementById("productName").value = "";

    createDefaultSizeFields();

    loadProducts();
  }
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  const response = await fetch("/api/products/" + id, {
    method: "DELETE",
  });

  const result = await response.json();

  alert(result.message);

  if (result.success) {
    loadProducts();
  }
}

function searchProducts() {

  const keyword =
      document
      .getElementById("productSearch")
      .value
      .toLowerCase();


  const filtered =
      allProducts.filter(product =>

          product.name
          .toLowerCase()
          .includes(keyword)

      );


  let rows = "";


  filtered.forEach(product => {

      rows += `

      <tr>

          <td>
              ${product.id}
          </td>

          <td>
              ${product.name}
          </td>


          <td>

              <button
              class="btn btn-danger btn-sm"
              onclick="deleteProduct(${product.id})">

                  Delete

              </button>

          </td>

      </tr>

      `;

  });


  document.getElementById("productTable").innerHTML =
      rows;

}

document
.getElementById("productSearch")
.addEventListener(
    "input",
    searchProducts
);

loadCategories();
