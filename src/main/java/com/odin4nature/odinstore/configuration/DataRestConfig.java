package com.odin4nature.odinstore.configuration;

import com.odin4nature.odinstore.entity.Order;
import com.odin4nature.odinstore.entity.Product;
import com.odin4nature.odinstore.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PUT, HttpMethod.PATCH};
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);

        disableHttpMethods(ProductCategory.class, config, unsupportedActions);
        disableHttpMethods(Product.class, config, unsupportedActions);
        disableHttpMethods(Order.class, config, unsupportedActions);
    }

    private void disableHttpMethods(Class clazz, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
        config.exposeIdsFor(clazz)
                .getExposureConfiguration()
                .forDomainType(clazz)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedActions)))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));
    }
}
