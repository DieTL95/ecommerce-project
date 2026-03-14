import AddToCartButton from "@/components/UI/AddToCartButton";
import MainWrapper from "@/components/UI/MainWrapper";
import ProductThumbnail from "@/components/UI/ProductThumbnail";
import { fetchOneProduct } from "@/utils/actions";
import { capitaliseTitle, dollarsPrice } from "@/utils/utils";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";

export const Route = createFileRoute("/products/$product/")({
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
  const [currentImage, setCurrentImage] = useState(0);
  const data = Route.useLoaderData();
  if (!data) {
    return <div>Such product doesn't exist</div>;
  }

  return (
    <MainWrapper>
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-[90%] flex flex-row">
          <div className="flex-3/4 flex flex-row  justify-center">
            {data.images && data.images.length > 0 && (
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-2">
                  {data.images.map((img, index) => (
                    <div
                      key={img.public_id}
                      onClick={() => setCurrentImage(index)}
                    >
                      <ProductThumbnail
                        imageId={img.public_id}
                        width={50}
                        height={75}
                      />
                    </div>
                  ))}
                </div>
                <div className="max-w-[450px]">
                  <InnerImageZoom
                    className="max-w-[350px]"
                    src={data.images[currentImage].secure_url}
                  />
                </div>
                {/* <ProductThumbnail
                  imageId={data.images[currentImage].public_id}
                  width={350}
                  height={525}
                /> */}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1/4 gap-4">
            <div className="font-serif text-xl">
              {capitaliseTitle(data.name)}
            </div>
            <div>{dollarsPrice(data.price)}</div>
            <AddToCartButton product={data} />
            <div>{data.description}</div>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
}
