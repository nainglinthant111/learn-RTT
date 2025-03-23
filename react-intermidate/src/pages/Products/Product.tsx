import { products, filterList } from "@/data/products";
import ProductCard from "@/components/Products/ProductCard";
import ProductFilter from "@/components/Products/ProductFilter";
import PaginationComponent from "@/components/Products/Pagination";
function Product() {
  return (
    <div className="container mx-auto px-4 lg:px-16">
      <section className="flex flex-col lg:flex-row">
        <section className="my-8 ml-4 w-full lg:ml-0 lg:w-1/5">
          <ProductFilter fileterList={filterList} />
        </section>
        <section className="ml-4 w-full lg:ml-0 lg:w-4/5">
          <h1 className="my-8 text-2xl font-bold">All Products</h1>
          <div className="mb-12 grid grid-cols-1 gap-6 gap-y-12 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-0">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <PaginationComponent />
        </section>
      </section>
    </div>
  );
}

export default Product;
