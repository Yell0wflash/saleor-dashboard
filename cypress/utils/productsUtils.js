import Attribute from "../apiRequests/Attribute";
import Category from "../apiRequests/Category";
import Product from "../apiRequests/Product";

class ProductsUtils {
  productRequest = new Product();
  attributeRequest = new Attribute();
  categoryRequest = new Category();

  product;
  variants;
  productType;
  attribute;
  category;

  createProductInChannel(
    name,
    channelId,
    warehouseId,
    quantityInWarehouse,
    productTypeId,
    attributeId,
    categoryId,
    price
  ) {
    return this.createProduct(attributeId, name, productTypeId, categoryId)
      .then(() =>
        this.productRequest.updateChannelInProduct(this.product.id, channelId)
      )
      .then(() => {
        this.createVariant(
          this.product.id,
          name,
          warehouseId,
          quantityInWarehouse,
          channelId,
          price
        );
      });
  }

  createTypeAttributeAndCategoryForProduct(name) {
    return this.createAttribute(name)
      .then(() => this.createTypeProduct(name, this.attribute.id))
      .then(() => this.createCategory(name));
  }
  createAttribute(name) {
    return this.attributeRequest
      .createAttribute(name)
      .then(
        resp => (this.attribute = resp.body.data.attributeCreate.attribute)
      );
  }
  createTypeProduct(name, attributeId) {
    return this.productRequest
      .createTypeProduct(name, attributeId)
      .then(
        resp =>
          (this.productType = resp.body.data.productTypeCreate.productType)
      );
  }
  createCategory(name) {
    return this.categoryRequest
      .createCategory(name)
      .then(resp => (this.category = resp.body.data.categoryCreate.category));
  }
  createProduct(attributeId, name, productTypeId, categoryId) {
    return this.productRequest
      .createProduct(attributeId, name, productTypeId, categoryId)
      .then(resp => (this.product = resp.body.data.productCreate.product));
  }
  createVariant(
    productId,
    name,
    warehouseId,
    quantityInWarehouse,
    channelId,
    price
  ) {
    return this.productRequest
      .createVariant(
        productId,
        name,
        warehouseId,
        quantityInWarehouse,
        channelId,
        price
      )
      .then(
        resp =>
          (this.variants =
            resp.body.data.productVariantBulkCreate.productVariants)
      );
  }

  getCreatedVariants() {
    return this.variants;
  }
  getProductType() {
    return this.productType;
  }
  getAttribute() {
    return this.attribute;
  }
  getCategory() {
    return this.category;
  }
  deleteProperProducts(startsWith) {
    const product = new Product();
    const attribute = new Attribute();
    const category = new Category();
    cy.deleteProperElements(
      product.deleteProductType,
      product.getProductTypes,
      startsWith,
      "productType"
    );
    cy.deleteProperElements(
      attribute.deleteAttribute,
      attribute.getAttributes,
      startsWith,
      "attributes"
    );
    cy.deleteProperElements(
      category.deleteCategory,
      category.getCategories,
      startsWith,
      "categories"
    );
  }
}
export default ProductsUtils;
