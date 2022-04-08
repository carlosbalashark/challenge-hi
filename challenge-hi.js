const tree = document.getElementById("tree");

const itemTree = (item, id, stateItemTree) => {
  const li = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  label.innerHTML = item.name;
  // for acessibility
  label.setAttribute("for", item.id);
  checkbox.name = item.id;
  checkbox.type = "checkbox";
  // set the checkbox checked depending on the state
  stateItemTree == "checked"
    ? (checkbox.checked = true)
    : (checkbox.checked = false);
  li.id = id;
  li.append(checkbox);
  li.append(label);
  return li;
};

const createItemTree = (id_parent, item, stateItemTree) => {
  if (id_parent) {
    const parent = document.getElementById(id_parent);
    let parent_ul = parent.getElementsByTagName("ul")[0];
    // check ul of parent exist
    if (parent_ul) {
      parent_ul.append(itemTree(item, item.id, stateItemTree));
      parent.append(parent_ul);
    } else {
      parent_ul = document.createElement("ul");
      parent_ul.append(itemTree(item, item.id, stateItemTree));
      parent.append(parent_ul);
    }
  } else {
    tree.append(itemTree(item, item.id, stateItemTree));
  }
};

const createTree = (obj, id_parent) => {
  for (let k in obj) {
    const item = obj[k];
    const stateItemTree = stateItemsTree(itemTree(item, item.id));
    createItemTree(id_parent, item, stateItemTree);
    if (item.children) {
      createTree(item.children, item.id);
    }
  }
};

const arrayItemsTree = (selector, parent = document) =>
  [].slice.call(parent.querySelectorAll(selector));

const collapseItemsTree = (element) => {
  const parent = element.parentNode.querySelector(["ul"]);
  if (!parent) return;
  if (element.checked) {
    parent.style.display = "block";
  } else {
    parent.style.display = "none";
  }
};

const stateItemsTree = (element, check) => {
  let elementStatus = localStorage.getItem(element.id);
  if (check == true) {
    localStorage.setItem(element.id, "checked");
  }
  if (check == false) {
    localStorage.removeItem(element.id);
  }
  return elementStatus;
};

const setIndeterminate = (check) => {
  while (check) {
    const parent = check.closest(["ul"])?.parentNode.querySelector("input");
    const siblings = arrayItemsTree(
      "input",
      parent?.closest("li").querySelector(["ul"])
    );

    const checkStatus = siblings.map((check) => check.checked);
    const every = checkStatus.every(Boolean);
    const some = checkStatus.some(Boolean);

    if (!parent) return;
    // set indeterminate if not all and not none are checked
    parent.indeterminate = !every && every !== some;
    // prepare for next loop
    check = check != parent ? parent : 0;
  }
};

// wait for the content to be loaded to set the indeterminate
document.addEventListener("DOMContentLoaded", function (event) {
  const items_tree = arrayItemsTree("input", tree.children.parentNode);
  items_tree.map((check) => {
    setIndeterminate(check);
  });
});

// set state, indeterminate and collapse when the tree changes
tree.addEventListener("change", (e) => {
  let check = e.target;
  const children = arrayItemsTree("input", check.parentNode);
  children.forEach((child) => {
    child.checked = check.checked;
    stateItemsTree(child.parentNode, child.checked);
    setIndeterminate(check);
    collapseItemsTree(child);
  });
});

createTree(data);