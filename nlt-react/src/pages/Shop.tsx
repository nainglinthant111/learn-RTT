import shop1 from "@/assets/image/shop1.jpeg";
import shop2 from "@/assets/image/shop2.jpeg";
import shop3 from "@/assets/image/shop3.jpeg";
import ProductCart from "@/components/ProductCart";
const products = [
  { id: 1, name: "T-Shirt", image: shop1, price: 200 },
  { id: 2, name: "V-Shirt", image: shop2, price: 300 },
  { id: 3, name: "Y-Shirt", image: shop3, price: 400 },
];
function Shop() {
  return (
    <section className="flex grow bg-gray-100 p-2">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCart key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Shop;
