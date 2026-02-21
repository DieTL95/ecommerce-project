import AddToCartButton from "@/components/UI/AddToCartButton";
import MainWrapper from "@/components/UI/MainWrapper";
import { fetchProducts } from "@/utils/actions";
import type { Products } from "@/utils/types";
import { dollarsPrice } from "@/utils/utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
  loader: async () => await fetchProducts(),
  head: () => ({
    meta: [
      { name: "Products", content: "The products." },
      { title: "Products" },
    ],
  }),
});

function RouteComponent() {
  const products: Products[] = Route.useLoaderData();

  if (!products) {
    return <div>Couldn't found nothing</div>;
  }

  return (
    <MainWrapper>
      <div className="w-full flex ">
        <div className="w-full flex flex-col  my-2 ">
          <div className="grid-cols-4 grid gap-2 h-full">
            {products.map((product) => (
              <div key={product.name} className="bg-black w-full h-full ">
                <div className="mx-auto w-fit">
                  <Link
                    to="/products/$product"
                    params={{ product: product.id }}
                  >
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0].secure_url}
                        alt={product.name}
                        className="max-h-52 max-w-[150px]"
                      />
                    )}

                    <div>{product.name}</div>
                  </Link>
                  <span>{dollarsPrice(product.price)}</span>

                  <AddToCartButton product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainWrapper>
  );
}
