import LeaveScreenDialog from "@saleor/components/LeaveScreenDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { useWarehouseList } from "@saleor/warehouses/queries";
import { warehouseListPath } from "@saleor/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

import { decimal, weight } from "../../misc";
import ProductVariantCreatePage, {
  ProductVariantCreatePageSubmitData
} from "../components/ProductVariantCreatePage";
import {
  useProductVariantReorderMutation,
  useVariantCreateMutation
} from "../mutations";
import { useProductVariantCreateQuery } from "../queries";
import {
  productListUrl,
  productUrl,
  productVariantAddUrl,
  ProductVariantAddUrlDialog,
  ProductVariantAddUrlQueryParams,
  productVariantEditUrl
} from "../urls";
import { createVariantReorderHandler } from "./ProductUpdate/handlers";

interface ProductVariantCreateProps {
  productId: string;
  params: ProductVariantAddUrlQueryParams;
}

export const ProductVariant: React.FC<ProductVariantCreateProps> = ({
  productId,
  params
}) => {
  const { action } = params;
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const warehouses = useWarehouseList({
    displayLoader: true,
    variables: {
      first: 50
    }
  });

  const { data, loading: productLoading } = useProductVariantCreateQuery({
    displayLoader: true,
    variables: { id: productId }
  });

  const [variantCreate, variantCreateResult] = useVariantCreateMutation({
    onCompleted: data => {
      if (data.productVariantCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(
          productVariantEditUrl(
            productId,
            data.productVariantCreate.productVariant.id
          )
        );
      }
    }
  });
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const product = data?.product;

  if (product === null) {
    return <NotFoundPage onBack={() => navigate(productListUrl())} />;
  }

  const [
    reorderProductVariants,
    reorderProductVariantsOpts
  ] = useProductVariantReorderMutation({});

  const handleVariantReorder = createVariantReorderHandler(product, variables =>
    reorderProductVariants({ variables })
  );

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductVariantAddUrlDialog,
    ProductVariantAddUrlQueryParams
  >(navigate, params => productVariantAddUrl(productId, params), params);

  const handleBack = () => navigate(productUrl(productId));
  const handleCreate = async (formData: ProductVariantCreatePageSubmitData) => {
    const result = await variantCreate({
      variables: {
        input: {
          attributes: formData.attributes
            .filter(attribute => attribute.value !== "")
            .map(attribute => ({
              id: attribute.id,
              values: [attribute.value]
            })),
          costPrice: decimal(formData.costPrice),
          price: decimal(formData.price),
          product: productId,
          sku: formData.sku,
          stocks: formData.stocks.map(stock => ({
            quantity: parseInt(stock.value, 0),
            warehouse: stock.id
          })),
          trackInventory: true,
          weight: weight(formData.weight)
        }
      }
    });

    return result.data.productVariantCreate?.productVariant?.id || null;
  };
  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata
  );
  const handleVariantClick = (id: string) =>
    navigate(productVariantEditUrl(productId, id));

  const disableForm =
    productLoading ||
    variantCreateResult.loading ||
    reorderProductVariantsOpts.loading;

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Create variant",
          description: "window title"
        })}
      />
      <ProductVariantCreatePage
        currencySymbol={shop?.defaultCurrency}
        disabled={disableForm}
        errors={variantCreateResult.data?.productVariantCreate.errors || []}
        header={intl.formatMessage({
          defaultMessage: "Create Variant",
          description: "header"
        })}
        product={data?.product}
        onBack={handleBack}
        onSubmit={handleSubmit}
        onVariantClick={handleVariantClick}
        onVariantReorder={handleVariantReorder}
        onWarehouseConfigure={() => openModal("leave-screen")}
        saveButtonBarState={variantCreateResult.status}
        warehouses={
          warehouses.data?.warehouses.edges.map(edge => edge.node) || []
        }
        weightUnit={shop?.defaultWeightUnit}
      />
      <LeaveScreenDialog
        onSubmit={() => navigate(warehouseListPath)}
        onClose={closeModal}
        open={action === "leave-screen"}
        confirmButtonState="default"
      />
    </>
  );
};
export default ProductVariant;
