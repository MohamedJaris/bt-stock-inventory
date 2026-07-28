async function loadCurrentStock(){

  const response =
      await fetch("/api/stock/current");


  const result =
      await response.json();



  if(!result.success){

      alert(result.message);

      return;

  }



  const products =
      result.products;


  const sizes =
      result.sizes;



  createHeader(sizes);


  createTable(products, sizes);


}





function createHeader(sizes){


  const header =
      document.getElementById("stockHeader");



  let html = `

      <th>
          Product
      </th>

  `;



  sizes.forEach(size=>{


      html += `

          <th>
              ${size.sizeName}
          </th>

      `;


  });



  html += `

      <th>
          Total
      </th>

  `;



  header.innerHTML = html;


}





function createTable(products, sizes){


  const tbody =
      document.getElementById("stockTable");


  tbody.innerHTML="";



  products.forEach(product=>{


      let row = `

      <tr>

      <td>
          ${product.name}
      </td>

      `;



      sizes.forEach(size=>{


          const qty =
              product.quantities[size.id]
              || 0;



          row += `

          <td>
              ${qty}
          </td>

          `;


      });



      row += `

          <td>
              <b>
              ${product.total}
              </b>
          </td>


          </tr>

      `;



      tbody.innerHTML += row;


  });



}




loadCurrentStock();