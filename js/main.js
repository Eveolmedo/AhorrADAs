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
        showElement(".table-header")
        hideElement("#no-operations")
        for (const {id, description, amount, category, date} of operations){
            const categorySelected = getLocalInfo("categories").find(cat => cat.id === category)
            $("#table-operations").innerHTML += `
                <td class="font-bold">${description}</td>
                <td class="text-emerald-600">${categorySelected.categoryName}</td>
                <td>${new Date(date).getDate()}/${new Date(date).getMonth() + 1}/${new Date(date).getFullYear()}</td>
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
        for (const category of categoryMoreRevenue(getLocalInfo("operations"))) {
            const categorySelected = getLocalInfo("categories").find(cat => cat.id === category.category)
            if (categorySelected) {
                $(".table-reports").innerHTML += `
                    <tr>
                        <th class="">Categoría con mayor ganancia</th>
                        <td class="text-emerald-600">${categorySelected.categoryName}</td>
                        <td class="text-green-500">+$${category.total}</td>
                    <tr>
                `
            }
        }
        for (const category of categoryMoreSpent(getLocalInfo("operations"))) {
            const categorySelected = getLocalInfo("categories").find(cat => cat.id === category.category)
            if (categorySelected) {
                $(".table-reports").innerHTML += `
                    <tr>
                        <th>Categoría con mayor gasto</th>
                        <td class="text-emerald-600">${categorySelected.categoryName}</td>
                        <td class="text-red-900">-$${category.total}</td>
                    <tr>
                `
            }
        }
        for (const category of categoryMoreBalance(getLocalInfo("operations"))) {
            const categorySelected = getLocalInfo("categories").find(cat => cat.id === category.category)
            if (categorySelected) {
                $(".table-reports").innerHTML += `
                    <tr>
                        <th class="my-4 mb-5">Categoría con mayor balance</th>
                        <td class="text-emerald-600">${categorySelected.categoryName}</td>
                        <td>+$${category.total}</td>
                    <tr>
                `
            }
        }
        for (const month of monthMoreRevenue(getLocalInfo("operations"))) {
            $(".table-reports").innerHTML += `
                    <tr>
                        <th class="my-4 mb-5">Mes con mayor ganancia</th>
                        <td class="text-emerald-600">${month.month}</td>
                        <td class="text-green-500">+$${month.total}</td>
                    <tr>
                `
        }
        for (const month of monthMoreSpent(getLocalInfo("operations"))) {
            $(".table-reports").innerHTML += `
                    <tr>
                        <th class="my-4 mb-5">Mes con mayor gasto</th>
                        <td class="text-emerald-600">${month.month}</td>
                        <td class="text-red-900">-$${month.total}</td>
                    <tr>
                `
        }
        for (const category of totalsByCategory(getLocalInfo("operations"))) {
            const categorySelected = getLocalInfo("categories").find(cat => cat.id === category.category)
            if (categorySelected) {
                $(".table-reports-category").innerHTML += `
                <td class="text-emerald-600">${categorySelected.categoryName}</td>
                <td class="text-green-500">+$${category.ganancias}</td>
                <td class="text-red-900">-$${category.gastos}</td>
                <td>$${category.ganancias - category.gastos}</td>
                `
            }
        }
        for (const month of totalsByMonth(getLocalInfo("operations"))) {
            $(".table-reports-month").innerHTML += `
                <td>${new Date(month.month).getMonth() + 1}/${new Date(month.month).getFullYear()}</td>
                <td class="text-green-500">+$${month.ganancias}</td>
                <td class="text-red-900">-$${month.gastos}</td>
                <td>$${month.ganancias - month.gastos}</td>
            `
        }  
    } else{
        showElement("#no-reports")
        hideElement(".reports-table-section")
    }
}

const saveOperationInfo = (operationId) => {
    return {
        id: operationId ? operationId : randomId(),
        description: $("#description").value,
        amount: $("#amount").valueAsNumber,
        type: $("#type").value,
        category: $("#form-category").value,
        date: new Date($("#date").value.replace(/-/g, '/'))
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
    const currentOperation = getLocalInfo("operations").filter((operation) => operation.id !== id)
    setLocalInfo("operations", currentOperation)
    showBalance(getLocalInfo("operations"))
    renderOperation(currentOperation)
}

const deleteCategory = (id) => {
    const currentCategory = getLocalInfo("categories").filter((category) => category.id !== id)
    const currentOperation = getLocalInfo("operations").filter((cat) => cat.category !== id)
    setLocalInfo("operations", currentOperation)
    setLocalInfo("categories", currentCategory)
    renderOperation(currentOperation)
    renderCategoriesTable(currentCategory)
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
    $("#date").value = new Date(operationSelect.date).toISOString().split('T')[0]
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
    $("#new-category").value = categorySelect.categoryName 
}

const showBalance = (operations) => {
    let contador = 0
    let contador2 = 0
    if (operations.length) { 
        for (const operation of operations) {
            if (operation.type === "ganancia") {
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
        $(".total").innerText = `$0`                   
        $(".total").classList.remove("text-green-500")
        $(".total").classList.remove("text-red-900")
    }
} // arreglar 

// REPORTS SECTION

const totalsByCategory = (operations) => {
    const categories = {}
    operations.forEach(operation => {
        const category = operation.category
  
        if (!categories[category]) {
            categories[category] = {
                category: category,
                gastos: 0,
                ganancias: 0
            }
        }
  
        if (operation.type === "gasto") {
            categories[category].gastos += operation.amount
        } else if (operation.type === "ganancia") {
            categories[category].ganancias += operation.amount
        }
    })
  
    const totals = []
    for (const category in categories) {
        totals.push(categories[category])
    }
  
    return totals
}

const categoryMoreRevenue = (operations) => {
    let acc = 0
    let category = ""
    let result = []
    for (const operation of totalsByCategory(operations)) {
        if (operation.ganancias > acc){
            acc = operation.ganancias
            category = operation.category
        }
    }
    
    const obj = { 
        category: category, 
        total: acc 
    }
    result.push(obj)

    return result
} 

const categoryMoreSpent = (operations) => {
    let acc = 0
    let category = ""
    let result = []
    for (const operation of totalsByCategory(operations)) {
        if (operation.gastos > acc){
            acc = operation.gastos
            category = operation.category
        }
    }
    
    const obj = { 
        category: category, 
        total: acc 
    }
    result.push(obj)

    return result
} 

const categoryMoreBalance = (operations) => {
    let acc = 0
    let category = ""
    let result = []
    for (const operation of totalsByCategory(operations)) {
        const total = operation.ganancias - operation.gastos
        if (total > 0 && total > acc) {
            acc = total
            category = operation.category
        }
    }
    
    const obj = { 
        category: category, 
        total: acc 
    }
    result.push(obj)

    return result
}

const totalsByMonth = (operations) => {
    const months = {}
    operations.forEach(operation => {
        const date = new Date(operation.date)
        const month = date.getMonth() + 1 // recibo un 5
  
        if (!months[month]) {
            months[month] = {
                month: operation.date,
                gastos: 0,
                ganancias: 0
            }
        }
  
        if (operation.type === "gasto") {
            months[month].gastos += operation.amount
        } else if (operation.type === "ganancia") {
            months[month].ganancias += operation.amount
        }
    })
  
    const totals = []
    for (const month in months) {
        totals.push(months[month])
    }

   return totals
}


const monthMoreRevenue = (operations) => {
    let acc = 0
    let month = ""
    let result = []
    for (const operation of totalsByMonth(operations)) {
        if (operation.ganancias > acc){
            acc = operation.ganancias
            month = operation.month
        }
    }

    month = new Date(month).toISOString().split('T')[0]

    const obj = { 
        month: month.replace(/-/g, '/'), 
        total: acc 
    }
    result.push(obj)

    return result
} 

const monthMoreSpent = (operations) => {
    let acc = 0
    let month = ""
    let result = []
    for (const operation of totalsByMonth(operations)) {
        if (operation.gastos > acc){
            acc = operation.gastos
            month = operation.month
        }
    }

    month = new Date(month).toISOString().split('T')[0]

    const obj = { 
        month: month.replace(/-/g, '/'), 
        total: acc 
    }
    result.push(obj)

    return result
}

// FILTERS

const filters = () => {
    const type = $("#filter-type").value
    const category = $("#filter-category").value
    const date = new Date($(".date").value.replace(/-/g, '/'))
    const filterS = $("#filter-sort").value

    const filterType = getLocalInfo("operations").filter((operation) => {
        if (type === "todos") {
            return operation
        }
        return type === operation.type
    })

    const filterCategory = filterType.filter((operation) => {
        if (category === "todas") {
            return operation
        } else {
            return category === operation.category
        }
    })

    const filterDate = filterCategory.filter((operation) => {
        return new Date(operation.date).getDate() >= date.getDate()
    })

   const filterSort = filterDate.sort((a, b) => {
        if (filterS === "mas-reciente"){
            return new Date(b.date).getDate() - new Date(a.date).getDate()
        } 
        if (filterS === "menos-reciente") {
            return new Date(a.date).getDate() - new Date(b.date).getDate()
        }
        if (filterS === "mayor-monto") {
            return b.amount - a.amount
        }
        if (filterS === "menor-monto") {
            return a.amount - b.amount
        }
        if (filterS === "a-z") {
            return b.description - a.description
        } else {
            return a.description - b.description
        }
   })
    
    return renderOperation(filterSort)
}


// INITIALIZE APP

const initializeApp = () => {
    setLocalInfo("operations", allOperations)
    renderOperation(allOperations)
    
    setLocalInfo("categories", allCategories)
    renderCategoriesTable(getLocalInfo("categories"))
    renderCategoriesOptions(allCategories)
    
    showBalance(getLocalInfo("operations"))
    
    renderReportTable(getLocalInfo("operations"))

    const formatDate = new Date().toISOString().split('T')[0]  // devuelve la fecha actual en formato ISO sin la hora ni la zona horaria AAAA-MM-DDTHH:mm:ss.sssZ

    $("#date").value = formatDate
    $(".date").value = formatDate

    $("#filter-type").addEventListener ("change", () => {
        filters()
    })

    $("#filter-category").addEventListener ("change", () => {
        filters()
    })

    $(".date").addEventListener ("change", () => {
        filters()
    })

    $("#filter-sort").addEventListener ("change", () => {
        filters()
    })


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
        renderOperation(getLocalInfo("operations"))
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
    })
    
    $(".close-navbar-menu").addEventListener('click', () =>{
        showElement(".burger-menu")
        hideElement(".menu")
        hideElement(".close-navbar-menu")
    })
}

window.addEventListener("load", initializeApp)