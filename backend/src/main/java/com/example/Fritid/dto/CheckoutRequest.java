package com.example.Fritid.dto;

public class CheckoutRequest {
    private PersonInfo personInfo;
    private CartItem[] cartItems;
    
    // Default constructor
    public CheckoutRequest() {}
    
    // Constructor with parameters
    public CheckoutRequest(PersonInfo personInfo, CartItem[] cartItems) {
        this.personInfo = personInfo;
        this.cartItems = cartItems;
    }
    
    // Getters and setters
    public PersonInfo getPersonInfo() {
        return personInfo;
    }
    
    public void setPersonInfo(PersonInfo personInfo) {
        this.personInfo = personInfo;
    }
    
    public CartItem[] getCartItems() {
        return cartItems;
    }
    
    public void setCartItems(CartItem[] cartItems) {
        this.cartItems = cartItems;
    }
    
    @Override
    public String toString() {
        return "CheckoutRequest{" +
                "personInfo=" + personInfo +
                ", cartItems=" + java.util.Arrays.toString(cartItems) +
                '}';
    }
}
