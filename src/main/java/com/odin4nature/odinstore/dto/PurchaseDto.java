package com.odin4nature.odinstore.dto;

import com.odin4nature.odinstore.entity.Address;
import com.odin4nature.odinstore.entity.Customer;
import com.odin4nature.odinstore.entity.Order;
import com.odin4nature.odinstore.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class PurchaseDto {

    private Customer customer;
    private Order order;
    private Address address;
    private Set<OrderItem> orderItems;

}
