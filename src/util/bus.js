function checkFilter(category, title, checked) {
  if (checked) this[category].push(title);
  else {
    let index = this[category].indexOf(title);
    if (index >= 0) this[category].splice(index, 1);
  }
}

export { checkFilter };