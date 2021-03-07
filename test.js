a = [
  {id: 2, quantity: 50, price: 700},
  {id: 1, quantity: 5, price: 300},
  {id: 3, quantity: 500, price: 300},
];

b = [
  {id: 3, quantity: 200},
  {id: 2, quantity: 20},
  {id: 1, quantity: 2},
];

console.log(a.map((_, i) => ({...a[i], ...b[i]})));