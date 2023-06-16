package com.odinstore.service;

import com.odinstore.dao.CustomerRepository;
import com.odinstore.dto.PaymentInfoDto;
import com.odinstore.dto.PurchaseDto;
import com.odinstore.dto.PurchaseResponseDto;
import com.odinstore.entity.Address;
import com.odinstore.entity.Customer;
import com.odinstore.entity.Order;
import com.odinstore.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private final CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               @Value("${stripe.key.secret}") String secretKey) {
        this.customerRepository = customerRepository;
        Stripe.apiKey = secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponseDto placeOrder(PurchaseDto purchase) {
        Order order = getOrderPopulatedWithData(purchase);
        Customer customer = getCorrectlyFilledOutCustomer(purchase.getCustomer(), order);

        customerRepository.save(customer);

        return new PurchaseResponseDto(order.getOrderTrackingNumber());
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfoDto paymentInfo) throws StripeException {
        List<String> paymentsMethodTypes = List.of("card");
        Map<String, Object> params = Map.of(
                "amount", paymentInfo.getAmount(),
                "currency", paymentInfo.getCurrency(),
                "receipt_email", paymentInfo.getReceiptEmail(),
                "payment_method_types", paymentsMethodTypes,
                "description", "Óðinns Butikk purchase");

        return PaymentIntent.create(params);
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

    private Customer getCorrectlyFilledOutCustomer(Customer customer, Order order) {
        Customer customerFromDB = customerRepository.findByEmail(customer.getEmail());
        return getCustomerPopulatedWithData(Objects.requireNonNullElse(customerFromDB, customer), order);
    }

    private Customer getCustomerPopulatedWithData(Customer customer, Order order) {
        customer.addOrder(order);
        return customer;
    }
}
