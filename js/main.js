const $ = (selector) => document.querySelector(selector)

const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")

const cleanContainer = (selector) => $(selector).innerHTML = ""

const randomId = () => self.crypto.randomUUID()

const getLocalInfo = (key) => JSON.parse(localStorage.getItem(key))  // agarra info del local
const setLocalInfo = (key, array) => localStorage.setItem(key, JSON.stringify(array))  // envia info al local

const defaultCategories = [
    {
        id: randomId(),
        categoryName: "Comida"
    },
    {
        id: randomId(),
        categoryName: "Servicios"
    },
    {
        id: randomId(),
        categoryName: "Salidas"
    },
    {
        id: randomId(),
        categoryName: "Educacion"
    },
    {
        id: randomId(),
        categoryName: "Trasporte"
    },
    {
        id: randomId(),
        categoryName: "Trabajo"
    }
]

const allOperations = getLocalInfo("operations") || []   // ejecuta lo que hay en el local en la key operaciones o si no hay nada un array vacio
const allCategories = getLocalInfo("categories") || defaultCategories

const renderOperation = (operations) => {
    cleanContainer("#table-operations")
    if (operations.length) {
        hideElement("#no-operations")
        for (const {id, description, amount, type, category, date} of operations){
            const categorySelected = getLocalInfo("categories").find(cat => cat.id === category)
            $("#table-operations").innerHTML += `
                <td class="font-bold">${description}</td>
                <td class="text-emerald-600">${categorySelected.categoryName}</td>
                <td>${date}</td>
                <td>${amount}</td>
                <td>
                    <button class="px-2 py-1 rounded text-white bg-green-500 hover:bg-lime-900" onclick="editOperationForm('${id}')">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="px-2 py-1 rounded text-white bg-red-800 hover:bg-red-900" onclick="deleteOperation('${id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `  
        }
    } else {
        showElement("#no-operations")
        hideElement(".table-header")
    }
}

const renderCategoriesOptions = (categories) => {
    cleanContainer("#form-category")
    for (const { categoryName, id } of categories) { 
        $("#form-category").innerHTML += `
            <option value="${id}">${categoryName}</option>
        `
        $("#filter-category").innerHTML += `
            <option value="${id}">${categoryName}</option>
        `
    }
}

const renderCategoriesTable = (categories) => {
    cleanContainer("#table-category")
    for (const { categoryName, id } of categories) { 
        $("#table-category").innerHTML += `
        <tr>
            <td class="text-emerald-600">${categoryName}</td>
            <td>
                <button class="px-2 py-1 rounded text-white bg-green-500 hover:bg-lime-900" onclick="editCategoryTable('${id}')">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="px-2 py-1 rounded text-white bg-red-800 hover:bg-red-900" onclick="deleteCategory('${id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `
    }
}

const renderReportTable = (operations) => {
    cleanContainer(".table-reports")
    if (operations.length){
        hideElement("#no-reports")
        showElement(".table-reports")
        $(".table-reports").innerHTML += `
            <td class="text-emerald-600">${categoryMoreRevenue(operations)[0]}</td>
            <td class="">${categoryMoreRevenue(operations)[1]}</td>
            <td class="text-emerald-600">${categoryMoreSpent(operations)[0]}</td>
            <td class="">${categoryMoreSpent(operations)[1]}</td>
        `
        
    } else{
        showElement("#no-reports")
        hideElement(".reports-table-section")
    }
}


// puede mejorar !!!!
const categoryMoreRevenue = (operations) => {
    let mejorCategoria = {}
    for (const operation of operations) {
        if (!mejorCategoria[operation.category] && operation.type === "Ganancia"){
            mejorCategoria[operation.category] = operation.amount
        } if (operation.type === "Ganancia" && mejorCategoria[operation.category]) {
            mejorCategoria[operation.category] = operation.amount
        }
    }
    let nombre = "";
    let precio = 0;
    // por cada elemento de mejor categoria
    for (const indice in mejorCategoria) {
        // el primer elemento es mayor  al precio ?
        if (mejorCategoria[indice] > precio) {
            // si es guarda en precio el numero
            precio = mejorCategoria[indice]
            // y en nombre el id
            nombre = indice
        }
    }
    const categorySelected = getLocalInfo("categories").find(cat => cat.id === nombre)
    return [categorySelected.categoryName, precio]
}

// puede mejorar !!!!
const categoryMoreSpent = (operations) => {
    let mejorCategoria = {}
    for (const operation of operations) {
        if (!mejorCategoria[operation.category] && operation.type === "Gasto"){
            mejorCategoria[operation.category] = operation.amount
        } if (operation.type === "Gasto" && mejorCategoria[operation.category]) {
            mejorCategoria[operation.category] = operation.amount
        }
    }
    console.log(mejorCategoria)
    let nombre = "";
    let precio = 0;
    // por cada elemento de mejor categoria
    for (const indice in mejorCategoria) {
        // el primer elemento es mayor  al precio ?
        if (mejorCategoria[indice] > precio) {
            // si es guarda en precio el numero
            precio = mejorCategoria[indice]
            // y en nombre el id
            nombre = indice
        }
    }
    const categorySelected = getLocalInfo("categories").find(cat => cat.id === nombre)
    return [categorySelected.categoryName, precio]
}
  
const saveOperationInfo = (operationId) => {
    return {
        id: operationId ? operationId : randomId(),
        description: $("#description").value,
        amount: $("#amount").valueAsNumber,
        type: $("#type").value,
        category: $("#form-category").value,
        date: $("#date").value
    }
}

const saveCategoryInfo = (categoryId) => {
    return {
        id: categoryId ? categoryId : randomId(),
        categoryName: $("#new-category").value
    }
}

const sendNewData = (key, callback) => {
    const currentData = getLocalInfo(key) // agarro las operaciones que tengo en el local actualmente
    const newData = callback() // guardo la informacion que puso el usuario
    currentData.push(newData) // accedo a lo que esta guardado en el local y agrego la nueva info
    setLocalInfo(key, currentData) // mando la nueva info al local en la key operations
}

const deleteOperation = (id) => {
    const currentOperation = getLocalInfo("operations").filter((operation) => operation.id !== id) // guardo todos menos ese
    setLocalInfo("operations", currentOperation)
    showBalance(getLocalInfo("operations"))
    renderOperation(currentOperation)
}

const editOperation = () => {
    const operationId = $("#btn-edit").getAttribute("data-id")
    const editedOperation = getLocalInfo("operations").map((operation) => {
        if(operation.id === operationId){
            return saveOperationInfo(operation.id)
        }
        return operation
    })
    setLocalInfo("operations", editedOperation)
}

const editOperationForm = (id) => {
    hideElement("#balance")
    showElement("#operation")
    hideElement("#btn-submit")
    showElement("#btn-edit")
    hideElement(".new-operation-title")
    showElement(".edit-operation-title")
    $("#btn-edit").setAttribute("data-id", id)  // paso el id del elemento al boton de edit
    const operationSelect = getLocalInfo("operations").find((operation) => operation.id === id)
    $("#description").value = operationSelect.description
    $("#amount").valueAsNumber = operationSelect.amount
    $("#type").value = operationSelect.type
    $("#form-category").value = operationSelect.category
    $("#date").value = operationSelect.date
}

const editCategory = () => {
    const categoryId = $("#btn-category-edit").getAttribute("data-id")
    const editedCategory = getLocalInfo("categories").map((category) =>{
        if (category.id === categoryId) {    // por cada categoria del array localizo el que me coincide con el id
            return saveCategoryInfo(category.id) // si es true guardo la info del form, lo que modifique lo guarde
        }
        return category // si no se cumple devuelvo lo que no se cambio
    })
    setLocalInfo("categories", editedCategory)
  }
  
const editCategoryTable = (id) => {
    hideElement("#table-category")
    hideElement("#btn-submit-category")
    hideElement(".category-title")
    showElement(".btns-edit-category")
    showElement(".edit-category-title")
    $("#btn-category-edit").setAttribute("data-id", id) 
    const categorySelect = getLocalInfo("categories").find((category) => category.id === id)
    $("#new-category").value = categorySelect.categoryName  // no esta aca el problema, aca me pone el value del id que recibo 
}

const showBalance = (operations) => {
    let contador = 0
    let contador2 = 0
    if (operations.length) { 
        for (const operation of operations) {
            if (operation.type === "Ganancia") {
                contador += operation.amount
                $(".revenue").innerText = `+$${contador}`
            } else {
                contador2 += operation.amount
                $(".spent").innerText = `-$${contador2}`
            }
        }
        const total = contador - contador2
        if (total > 0){
            $(".total").classList.add("text-green-500")
            $(".total").classList.remove("text-red-900")
            $(".total").innerText = `+$${total}`
        } else {
            $(".total").classList.add("text-red-900")
            $(".total").classList.remove("text-green-500")
            $(".total").innerText = `-$${-total}`
        }
    }
    else {
        $(".total").innerText = `$0`                   // falta que ponga en 0 la ganancia y el gasto
        $(".total").classList.remove("text-green-500")
        $(".total").classList.remove("text-red-900")
    }
}

// INITIALIZE APP

const initializeApp = () => {
    setLocalInfo("operations", allOperations)
    renderOperation(allOperations)

    setLocalInfo("categories", allCategories)
    renderCategoriesTable(allCategories)
    renderCategoriesOptions(allCategories)

    showBalance(getLocalInfo("operations"))

    renderReportTable(getLocalInfo("operations"))

    $("#btn-submit").addEventListener("click", (e) => {
        e.preventDefault()
        sendNewData("operations", saveOperationInfo)
        // aca agregar gasto o ganancia
    })

    $("#btn-edit").addEventListener("click", (e) => {
        e.preventDefault()
        editOperation()
        hideElement("#operation")
        showElement("#balance")
        renderOperation(getLocalInfo("operations")) // si no lo pongo tengo que actualizar el html para que aparezca lo que edite 
    })

    $("#btn-category-edit").addEventListener("click", (e) => {
        e.preventDefault()
        editCategory()
        hideElement(".btns-edit-category")
        hideElement(".edit-category-title")
        showElement("#table-category")
        showElement("#btn-submit-category")
        showElement(".category-title")
        renderCategoriesTable(getLocalInfo("categories"))
      })
    
    $("#btn-submit-category").addEventListener("click", (e) => {
        e.preventDefault()
        sendNewData("categories", saveCategoryInfo)
        const currentCategories = getLocalInfo("categories")
        renderCategoriesTable(currentCategories)
        renderCategoriesOptions(currentCategories)
    })
    
    /* $("#button-balance-section").addEventListener("click", () => {
        showElement($("#balance"))
        hideElement($("#category-section"))
        hideElement($("#reports"))                  POR AHORA NO
        hideElement($("#operation"))
    }) */
    
    $("#button-category-section").addEventListener("click", () => {
        showElement("#category-section")
        hideElement("#balance")
        hideElement("#reports")
        hideElement("#operation")
    })
    
    $("#button-reports-section").addEventListener("click", () => {
        showElement("#reports")
        hideElement("#balance")
        hideElement("#category-section")
        hideElement("#operation")
    })
    
    $(".hide-filter").addEventListener("click", () => {
        hideElement(".filter-form")
        hideElement(".hide-filter")
        showElement(".show-filter")
    })
    
    $(".show-filter").addEventListener("click", () => {
        showElement(".filter-form")
        showElement(".hide-filter")
        hideElement(".show-filter")
    })
    
    $("#add-operation-btn").addEventListener("click", () => {
        hideElement("#balance")
        showElement("#operation")
        showElement("#operation")
        showElement(".new-operation-title")
        hideElement(".edit-operation-title")
    })
    
    $(".burger-menu").addEventListener('click', () =>{
        showElement(".menu")
        hideElement(".burger-menu")
        showElement(".close-navbar-menu")
    });
    
    $(".close-navbar-menu").addEventListener('click', () =>{
        showElement(".burger-menu")
        hideElement(".menu")
        hideElement(".close-navbar-menu")
    });
}

window.addEventListener("load", initializeApp)