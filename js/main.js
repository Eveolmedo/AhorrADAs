const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

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
    $("#table-operations").innerHTML = ""
    if (operations.length) {
        hideElement("#no-operations")
        for (const {id, description, amount, category, date} of operations){
            $("#table-operations").innerHTML += `
                <td class="font-bold">${description}</td>
                <td class="text-emerald-600">${category}</td>
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

const renderCategories = (categories) => {
    cleanContainer("#table-category")
    for (const { categoryName } of categories) { 
        $("#table-category").innerHTML += `
        <tr>
            <td class="text-emerald-600">${categoryName}</td>
            <td>
                <button class="px-2 py-1 rounded text-white bg-green-500 hover:bg-lime-900">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="px-2 py-1 rounded text-white bg-red-800 hover:bg-red-900">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `
    }
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

const addOperationInfo = () => {
    const currentOperation = getLocalInfo("operations")  // agarro las operaciones que tengo en el local actualmente
    const newOperation = saveOperationInfo()  // guardo la informacion que puso el usuario
    currentOperation.push(newOperation) // accedo a lo que esta guardado en el local y agrego la nueva info
    setLocalInfo("operations", currentOperation) // mando la nueva info al local en la key operations
}

const deleteOperation = (id) => {
    const currentOperation = getLocalInfo("operations").filter((operation) => operation.id !== id) // guardo todos menos ese
    setLocalInfo("operations", currentOperation)
    renderOperation(currentOperation)
}

const editOperation = () => {
    const operationId = $("#btn-edit").getAttribute("data-id")
    const editedOperation = getLocalInfo("operations").map((operation) =>{
        if(operation.id === operationId){
            return saveOperationInfo()
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

const addCategory = () => {
    const currentCategory = getLocalInfo("categories")
    console.log(currentCategory)
}

// INITIALIZE APP

const initializeApp = () => {
    setLocalInfo("operations", allOperations)
    renderOperation(allOperations)

    setLocalInfo("categories", allCategories)
    renderCategories(allCategories)

    $("#btn-submit").addEventListener("click", (e) => {
        e.preventDefault()
        addOperationInfo()
        // aca agregar gasto o ganancia
    })

    $("#btn-edit").addEventListener("click", (e) => {
        e.preventDefault()
        editOperation()
        hideElement("#operation")
        showElement("#balance")
        renderOperation(getLocalInfo("operations")) // si no lo pongo tengo que actualizar el html para que aparezca lo que edite 
    })


    /* $("#button-balance-section").addEventListener("click", () => {
        showElement($("#balance"))
        hideElement($("#category"))
        hideElement($("#reports"))                  POR AHORA NO
        hideElement($("#operation"))
    }) */
    
    $("#button-category-section").addEventListener("click", () => {
        showElement("#category")
        hideElement("#balance")
        hideElement("#reports")
        hideElement("#operation")
    })
    
    $("#button-reports-section").addEventListener("click", () => {
        showElement("#reports")
        hideElement("#balance")
        hideElement("#category")
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