package com.example.Fritid.services;

import com.example.Fritid.models.Order;
import com.example.Fritid.models.OrderItem;
import com.example.Fritid.models.User;
import com.example.Fritid.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Integer id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }

    public List<Order> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public List<Order> getOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate);
    }

    @Transactional
    public Order createOrder(Integer userId, List<OrderItem> orderItems) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        User user = userOpt.get();

        // Calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : orderItems) {
            totalAmount = totalAmount.add(item.getPrice().multiply(new BigDecimal(item.getQuantity())));
        }

        // Create order
        Order order = new Order(user, totalAmount, Order.OrderStatus.PENDING);
        order = orderRepository.save(order);

        // Set order reference in order items
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        order.setOrderItems(orderItems);
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Integer orderId, Order.OrderStatus newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found with id: " + orderId);
    }

    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }

    public Long countOrdersByUserId(Integer userId) {
        return orderRepository.countOrdersByUserId(userId);
    }

    @Transactional
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    @Transactional
    public Order createOrderWithShipping(
            User user, List<OrderItem> orderItems,
            String firstName, String lastName, String email,
            String address, String postalCode, String city,
            String country, String phoneNumber) {
        // Calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : orderItems) {
            totalAmount = totalAmount.add(item.getPrice().multiply(new BigDecimal(item.getQuantity())));
        }

        // Create order
        Order order = new Order();
        order.setUser(user); // Can be null for guest orders
        order.setTotalAmount(totalAmount);
        order.setStatus(Order.OrderStatus.PENDING);

        // Set shipping information
        order.setShippingFirstName(firstName);
        order.setShippingLastName(lastName);
        order.setShippingEmail(email);
        order.setShippingAddress(address);
        order.setShippingPostalCode(postalCode);
        order.setShippingCity(city);
        order.setShippingPhoneNumber(phoneNumber);

        // Save order first to get ID
        order = orderRepository.save(order);

        // Set order reference in order items and save
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        order.setOrderItems(orderItems);
        return orderRepository.save(order);
    }
}
