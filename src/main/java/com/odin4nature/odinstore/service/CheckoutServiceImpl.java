package com.odin4nature.odinstore.service;

import com.odin4nature.odinstore.dao.CustomerRepository;
import com.odin4nature.odinstore.dto.PurchaseDto;
import com.odin4nature.odinstore.dto.PurchaseResponseDto;
import com.odin4nature.odinstore.entity.Address;
import com.odin4nature.odinstore.entity.Customer;
import com.odin4nature.odinstore.entity.Order;
import com.odin4nature.odinstore.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private final CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponseDto placeOrder(PurchaseDto purchase) {
        Order order = getOrderPopulatedWithData(purchase);
        Customer customer = getCustomerPopulatedWithData(purchase, order);

        customerRepository.save(customer);

        return new PurchaseResponseDto(order.getOrderTrackingNumber());
    }

    private Order getOrderPopulatedWithData(PurchaseDto purchase) {
        Order order = purchase.getOrder();
        setGeneratedTrackingNumberToOrder(order);
        populateOrderWithOrderItems(order, purchase);
        populateOrderWithAddress(order, purchase);
        return order;
    }

    private void setGeneratedTrackingNumberToOrder(Order order) {
        order.setOrderTrackingNumber(generateOrderTrackingNumber());
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }

    private void populateOrderWithOrderItems(Order order, PurchaseDto purchase) {
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::addOrderItem);
    }

    private void populateOrderWithAddress(Order order, PurchaseDto purchase) {
        Address address = purchase.getAddress();
        order.setAddress(address);
    }

    private Customer getCustomerPopulatedWithData(PurchaseDto purchase, Order order) {
        Customer customer = purchase.getCustomer();
        customer.addOrder(order);
        return customer;
    }
}
