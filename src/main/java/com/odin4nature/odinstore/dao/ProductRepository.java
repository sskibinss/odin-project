package com.odin4nature.odinstore.dao;

import com.odin4nature.odinstore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
