create table address
(
    id          bigint auto_increment
        primary key,
    city        varchar(255) null,
    country     varchar(255) null,
    state       varchar(255) null,
    address     varchar(255) null,
    address2    varchar(255) null,
    postal_code varchar(255) null
);

create table address_seq
(
    next_val bigint null
);

create table customer
(
    id           bigint auto_increment
        primary key,
    first_name   varchar(255) null,
    last_name    varchar(255) null,
    email        varchar(255) null,
    phone_number varchar(255) null,
    constraint email
        unique (email)
);

create table customer_seq
(
    next_val bigint null
);

create table order_item_seq
(
    next_val bigint null
);

create table orders
(
    id                    bigint auto_increment
        primary key,
    order_tracking_number varchar(255)   null,
    total_price           decimal(19, 2) null,
    total_quantity        int            null,
    address_id            bigint         null,
    customer_id           bigint         null,
    status                varchar(128)   null,
    date_created          datetime(6)    null,
    last_updated          datetime(6)    null,
    constraint UK_address_id
        unique (address_id),
    constraint FK_address_id
        foreign key (address_id) references address (id),
    constraint FK_customer_id
        foreign key (customer_id) references customer (id)
);

create index K_customer_id
    on orders (customer_id);

create table orders_seq
(
    next_val bigint null
);

create table product_category
(
    id            bigint auto_increment
        primary key,
    category_name varchar(255) null
);

create table product
(
    id             bigint auto_increment
        primary key,
    sku            varchar(255)     null,
    name           varchar(255)     null,
    description    varchar(800)     null,
    unit_price     decimal(13, 2)   null,
    image_url      varchar(255)     null,
    active         bit default b'1' null,
    units_in_stock int              null,
    date_created   datetime(6)      null,
    last_updated   datetime(6)      null,
    category_id    bigint           not null,
    constraint fk_category
        foreign key (category_id) references product_category (id)
);

create table order_item
(
    id         bigint auto_increment
        primary key,
    image_url  varchar(255)   null,
    quantity   int            null,
    unit_price decimal(19, 2) null,
    order_id   bigint         null,
    product_id bigint         null,
    constraint FK_order_id
        foreign key (order_id) references orders (id),
    constraint FK_product_id
        foreign key (product_id) references product (id)
);

create index K_order_id
    on order_item (order_id);

create table product_category_seq
(
    next_val bigint null
);

create table product_seq
(
    next_val bigint null
);

