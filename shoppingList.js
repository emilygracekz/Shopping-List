const shoppingForm = document.querySelector(".shopping");
const list = document.querySelector(".list");

//create an array to hold state
let items = [];

function handleSubmit(e) {
  e.preventDefault();
  console.log("submitted!");
  const name = e.currentTarget.item.value;
  if (!name) return;
  const item = {
    name,
    id: Date.now(),
    complete: false
  };
  //push the items into state
  items.push(item);
  console.log(`There are now ${items.length} items in your state`);
  //clear the form
  e.target.reset();
  //fire custom event that tells if items are updated
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function displayItems() {
  console.log(items);
  const html = items
    .map(
      items =>
        `<li class="shopping-item">
    <input value="${items.id}" type="checkbox"
    ${items.complete ? 'checked' : ''}
    >
    <span class="itemName">
    ${items.name}</span>
    <button aria-label="Remove ${items.name}"
    value="${items.id}"
    >&times;</button>
    <li>`
    )
    .join("");
  list.innerHTML = html;
}
function mirrorToLocalStorage() {
  console.info("Saving items to localstorage");
  localStorage.setItem("items", JSON.stringify(items));
}

function restoreFromLocalStorage() {
  const lsItems = JSON.parse(localStorage.getItem("items"));
  if (lsItems.length) {
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
  }
}

function deleteItem(id) {
  console.log("deleting", id);
  //update items array without deleted
  items = items.filter(items => items.id !== id);
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function markAsComplete(id) {
    console.log('marking as complete', id);
    const itemRef = items.find(items => items.id === id);
    itemRef.complete = !itemRef.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener("submit", handleSubmit);
list.addEventListener("itemsUpdated", displayItems);
list.addEventListener("itemsUpdated", mirrorToLocalStorage);

//event delegation- listen on the list UL but delegate the click to the button that was clicked
list.addEventListener("click", function(e) {
    const id = (parseInt(e.target.value));
  if (e.target.matches("button")) {
      console.log(e.target, e.target.value)
    deleteItem(id);
  }
  if(e.target.matches('input[type="checkbox"]')) {
      markAsComplete(id);
  }
});
restoreFromLocalStorage();
