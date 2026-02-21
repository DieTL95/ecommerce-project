import AddToCartButton from "@/components/UI/AddToCartButton";
import MainWrapper from "@/components/UI/MainWrapper";
import { dollarsPrice } from "@/utils/utils";
import { fetchOneProduct } from "@/zactions/productActions";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$category/$product/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const res = await fetchOneProduct(params.product);
    if (!res) {
      throw notFound();
    }
    return res;
  },
  notFoundComponent: () => <div>Such product doesn't exist.</div>,

  head: (arg) => ({
    meta: [
      { name: "description", content: arg.loaderData?.description },
      { title: arg.loaderData?.name },
    ],
  }),
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <MainWrapper>
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex flex-row">
          <div className="flex-3/4 flex flex-row justify-center">
            {data.images && data.images.length > 0 && (
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-2">
                  {data.images.map((img) => (
                    <img src={img.secure_url} className="max-w-[50px]" />
                  ))}
                </div>

                <img
                  src={data.images[0].secure_url}
                  className="max-w-[350px]"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1/4">
            <div>{data.name}</div>
            <div>{dollarsPrice(data.price)}</div>
            <div>{data.description}</div>
            <AddToCartButton product={data} />
          </div>
        </div>
      </div>
    </MainWrapper>
  );
}
