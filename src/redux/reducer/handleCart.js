const initialState = JSON.parse(localStorage.getItem('cart')) || [];

const handleCart = (state = initialState, action) => {
  let updatedCart;

  switch (action.type) {
    case "ADDITEM": {
      const product = action.payload;
      const exist = state.find((x) => x.id === product.id);

      if (exist) {
        if (exist.qty >= product.stock) {
          alert("Not enough stock available.");
          return state;
        }
        updatedCart = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        if (product.stock <= 0) {
          alert("Not enough stock available.");
          return state;
        }
        updatedCart = [...state, { ...product, qty: 1 }];
      }
      break;
    }

    case "DELITEM": {
      const product = action.payload;
      const exist = state.find((x) => x.id === product.id);

      if (exist.qty === 1) {
        updatedCart = state.filter((x) => x.id !== product.id);
      } else {
        updatedCart = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty - 1 } : x
        );
      }
      break;
    }

    // redux/reducers/handleCart.js
    case "EMPTY_CART":
      return [];
    
    case "SET_CART":
  localStorage.setItem('cart', JSON.stringify(action.payload));
  return action.payload;

    default:
      return state;
  }


};

export default handleCart;
