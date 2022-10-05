import { List_Product_Image } from "./list_product_image";

export class List_Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  createDate: Date;
  updatedDate: Date;
  productImageFiles?: List_Product_Image[];
  imagePath: string;
}
