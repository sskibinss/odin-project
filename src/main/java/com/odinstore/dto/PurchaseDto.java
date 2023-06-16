package com.odinstore.dto;

import com.odinstore.entity.Address;
import com.odinstore.entity.Customer;
import com.odinstore.entity.Order;
import com.odinstore.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class PurchaseDto {
    private Customer customer;
    private Order order;
    private Address address;
    private Set<OrderItem> orderItems;

}
