const $ = (selector) => document.querySelector(selector)
const showElement = (selector) => selector.classList.remove("hidden")
const hideElement = (selector) => selector.classList.add("hidden")

$("#button-balance-section").addEventListener("click", () =>{
    showElement($("#balance"))
    hideElement($("#category"))
    hideElement($("#reports"))
})

$("#button-category-section").addEventListener("click", () =>{
    showElement($("#category"))
    hideElement($("#balance"))
    hideElement($("#reports"))
})

$("#button-reports-section").addEventListener("click", () =>{
    showElement($("#reports"))
    hideElement($("#balance"))
    hideElement($("#category"))
})

$(".hide-filter").addEventListener("click", () =>{
    hideElement($(".filter-form"))
    hideElement($(".hide-filter"))
    showElement($(".show-filter"))
})

$(".show-filter").addEventListener("click", () =>{
    showElement($(".filter-form"))
    showElement($(".hide-filter"))
    hideElement($(".show-filter"))

})



