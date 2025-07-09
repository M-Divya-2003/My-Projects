// redux/actions/index.js
export const emptyCart = () => {
  return {
    type: "EMPTY_CART",
  };
};


export const addCart = (products) => {
    return {
        type:"ADDITEM",
        payload: products
    }
}

export const delCart = (products) => {
    return {
        type:"DELITEM",
        payload: products
    }
}

export const setCart = (cartItems) => {
  return {
    type: "SET_CART",
    payload: cartItems,
  };
};
