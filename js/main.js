const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// Show or hide handlers
const showElements = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.remove("hidden")
    }
}
const hideElements = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add("hidden")
    }
}

const cleanContainer = (selector) => $(selector).innerHTML = ""

// Random id generator
const randomId = () => self.crypto.randomUUID()

// LocalStorage Handlers
const getLocalInfo = (key) => JSON.parse(localStorage.getItem(key))
const setLocalInfo = (key, array) => localStorage.setItem(key, JSON.stringify(array))

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

// LocalStorage keys
const allOperations = getLocalInfo("operations") || [] 
const allCategories = getLocalInfo("categories") || defaultCategories

// TABLES

const renderOperation = (operations) => {
    cleanContainer("#table-operations")
    if (operations.length) {
        showElements([".table-header"])
        hideElements(["#no-operations"])
        for (const {id, description, amount, category, date} of operations){
            const categorySelected = getLocalInfo("categories").find(cat => cat.id === category)
            $("#table-operations").innerHTML += `
            <tr class="md:hidden">
                <td class="font-bold">${description}</td>
            </tr>
                <td class="hidden md:block font-bold">${description}</td>
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
            </tr>
            `  
        } 
    } else {
        showElements(["#no-operations"])
        hideElements([".table-header"])
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
        <tr class="flex justify-between">
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

const revenue = (operations) => operations.filter((operation) => operation.type === "ganancia") 
const expense = (operations) => operations.filter((operation) => operation.type === "gasto")

const renderReportTable = (operations) => {
    cleanContainer(".table-reports")
    cleanContainer(".table-reports-category")
    cleanContainer(".table-reports-month") 
    if (revenue(operations).length && expense(operations).length) {
        hideElements(["#no-reports"])
        showElements([".reports-table-section"])
        for (const category of categoryMoreRevenue(getLocalInfo("operations"))) {
            const categorySelected = getLocalInfo("categories").find(cat => cat.id === category.category)
            $(".table-reports").innerHTML += `
                <tr>
                    <th class="">Categoría con mayor ganancia</th>
                    <td class="text-emerald-600">${categorySelected.categoryName}</td>
                    <td class="text-green-500">+$${category.total}</td>
                <tr>
            `
        }
        for (const category of categoryMoreSpent(getLocalInfo("operations"))) {
            const categorySelected = getLocalInfo("categories").find(cat => cat.id === category.category)
            $(".table-reports").innerHTML += `
                <tr>
                    <th>Categoría con mayor gasto</th>
                    <td class="text-emerald-600">${categorySelected.categoryName}</td>
                    <td class="text-red-900">-$${category.total}</td>
                <tr>
            `
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
                    <td class="text-emerald-600">${new Date(month.month).getDate()}/${new Date(month.month).getMonth() + 1}/${new Date(month.month).getFullYear()}</td>
                    <td class="text-green-500">+$${month.total}</td>
                <tr>
            `
        }
        for (const month of monthMoreSpent(getLocalInfo("operations"))) {
            $(".table-reports").innerHTML += `
                <tr>
                    <th class="my-4 mb-5">Mes con mayor gasto</th>
                    <td class="text-emerald-600">${new Date(month.month).getDate()}/${new Date(month.month).getMonth() + 1}/${new Date(month.month).getFullYear()}</td>
                    <td class="text-red-900">-$${month.total}</td>
                <tr>
            `
        }
        for (const category of totalsByCategory(getLocalInfo("operations"))){
            const categorySelected = getLocalInfo("categories").find(cat => cat.id === category.category)
            $(".table-reports-category").innerHTML += `
                <td class="text-emerald-600">${categorySelected.categoryName}</td>
                <td class="text-green-500">+$${category.ganancias}</td>
                <td class="text-red-900">-$${category.gastos}</td>
                <td>$${category.ganancias - category.gastos}</td>
            `
        }
        for (const month of totalsByMonth(getLocalInfo("operations"))) {
            $(".table-reports-month").innerHTML += `
                <td>${new Date(month.month).getMonth() + 1}/${new Date(month.month).getFullYear()}</td>
                <td class="text-green-500">+$${month.ganancias}</td>
                <td class="text-red-900">-$${month.gastos}</td>
                <td>$${month.ganancias - month.gastos}</td>
            `
        }  
    } else {
        showElements(["#no-reports"])
        hideElements([".reports-table-section"])
    }
}

// SAVE INFO

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
    const currentData = getLocalInfo(key) 
    const newData = callback() 
    currentData.push(newData) 
    setLocalInfo(key, currentData) 
}

// DELETE BUTTONS

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
    renderReportTable(currentOperation)
}

// EDIT BUTTONS

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
    hideElements(["#balance", "#btn-submit", ".new-operation-title"])
    showElements(["#operation", "#btn-edit", ".edit-operation-title"])
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
    hideElements(["#table-category", "#btn-submit-category", ".category-title"])
    showElements([".btns-edit-category", ".edit-category-title"])
    $("#btn-category-edit").setAttribute("data-id", id) 
    const categorySelect = getLocalInfo("categories").find((category) => category.id === id)
    $("#new-category").value = categorySelect.categoryName 
}

// VALIDATES

const validateForm = () => {
    const description = $("#description").value.trim()

    if (description == "") {
        showElements([".description-error"])
    } else {
        hideElements([".description-error"])
    }

    return description !== ""
}

// BALANCE SECTION

const showBalance = (operations) => {
    let total = 0
    let cont1 = 0
    let cont2 = 0
    if (operations.length) { 
        for (const operation of totalsByCategory(operations)) {
            cont1 += operation.ganancias
            $(".revenue").innerText = `+$${cont1}`
            cont2 += operation.gastos
            $(".spent").innerText = `-$${cont2}`
        }
        total = cont1 - cont2
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
        $(".revenue").innerText = `+$0` 
        $(".spent").innerText = `-$0`               
        $(".total").classList.remove("text-green-500")
        $(".total").classList.remove("text-red-900")
    }
}

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
        const month = date.getMonth() + 1 
  
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

    const obj = { 
        month: month,
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

    const obj = { 
        month: month,
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
            if (a.description.toUpperCase() < b.description.toUpperCase()) {
                return -1
            }
        }
        else {
            if (b.description.toUpperCase() < a.description.toUpperCase()) {
                return -1
            }
        }
   })

    showBalance(filterSort)
    return renderOperation(filterSort)
}

// DATES

const dates = () => {
    const actualDate = new Date()
    actualDate.setDate(1)
    // used the setDate(1) method to set the day to 1 of the month
    $(".date").value = actualDate.toISOString().split('T')[0]
    $("#date").value = new Date().toISOString().split('T')[0] 
    // returns the current date in ISO format without the time and time zone YYYY-MM-DDTHH:mm:ss.sssZ
}

// INITIALIZE APP

const initializeApp = () => {
    // Operations
    setLocalInfo("operations", allOperations)
    renderOperation(allOperations)
    
    // Categories
    setLocalInfo("categories", allCategories)
    renderCategoriesTable(getLocalInfo("categories"))
    renderCategoriesOptions(allCategories)
    
    // Balance
    showBalance(allOperations)

    // Reports
    renderReportTable(allOperations)

    // Dates in inputs
    dates()

    // Buttons 
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
        if (validateForm()){
            sendNewData("operations", saveOperationInfo)
        }
    })

    $("#btn-edit").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateForm()){
            editOperation()
            hideElements(["#operation"])
            showElements(["#balance"])
            renderOperation(allOperations)
        }
    })

    $("#btn-category-edit").addEventListener("click", (e) => {
        e.preventDefault()
        editCategory()
        showElements(["#table-category", ".category-title", "#btn-submit-category"])
        hideElements([".btns-edit-category", ".edit-category-title"])
        renderCategoriesTable(allCategories)
    })
    
    $("#btn-submit-category").addEventListener("click", (e) => {
        e.preventDefault()
        sendNewData("categories", saveCategoryInfo)
        const currentCategories = getLocalInfo("categories")
        renderCategoriesTable(currentCategories)
        renderCategoriesOptions(currentCategories)
    })

    const buttonsCategory = $$(".btn-category-section")
    for (const button of buttonsCategory) {
        button.addEventListener("click", () => { 
            showElements(["#category-section"])
            hideElements(["#balance", "#reports", "#operation"])
        })
    }

    const buttonsReports = $$(".btn-reports-section")
    for (const button of buttonsReports) {
        button.addEventListener("click", () => {
            showElements(["#reports"])
            hideElements(["#balance", "#category-section", "#operation"])
            renderOperation(getLocalInfo("operations"))
            renderReportTable(getLocalInfo("operations"))
        })
    }
    
    $(".hide-filter").addEventListener("click", () => {
        hideElements([".filter-form", ".hide-filter"])
        showElements([".show-filter"])
    })
    
    $(".show-filter").addEventListener("click", () => {
        showElements([".filter-form", ".hide-filter"])
        hideElements([".show-filter"])
    })
    
    $("#add-operation-btn").addEventListener("click", () => {
        hideElements(["#balance", ".edit-operation-title"])
        showElements(["#operation", ".new-operation-title"])
    })
    
    $(".burger-menu").addEventListener('click', () =>{
        showElements([".menu", ".close-navbar-menu"])
        hideElements([".burger-menu"])
    })
    
    $(".close-navbar-menu").addEventListener('click', () =>{
        showElements([".burger-menu"])
        hideElements([".menu", ".close-navbar-menu"])
    })
}

window.addEventListener("load", initializeApp)