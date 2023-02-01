package com.odin4nature.odinstore.dao;

import com.odin4nature.odinstore.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
