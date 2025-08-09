package com.example.Fritid.dto;

public class CheckoutRequest {
    private PersonInfo personInfo;
    private CartItem[] cartItems;
    private Integer userId; // Optional - for logged-in users
    
    // Default constructor
    public CheckoutRequest() {}
    
    // Constructor with parameters
    public CheckoutRequest(PersonInfo personInfo, CartItem[] cartItems) {
        this.personInfo = personInfo;
        this.cartItems = cartItems;
    }
    
    // Constructor with userId
    public CheckoutRequest(PersonInfo personInfo, CartItem[] cartItems, Integer userId) {
        this.personInfo = personInfo;
        this.cartItems = cartItems;
        this.userId = userId;
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
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    @Override
    public String toString() {
        return "CheckoutRequest{" +
                "personInfo=" + personInfo +
                ", cartItems=" + java.util.Arrays.toString(cartItems) +
                ", userId=" + userId +
                '}';
    }
}
