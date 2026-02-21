import { createFileRoute, notFound } from "@tanstack/react-router";
import LanderImageComponent from "../components/Home/LanderImage";
import LanderProducts from "../components/Home/LanderProducts";
import LanderCategories from "../components/Home/LanderCategories";
import MainWrapper from "@/components/UI/MainWrapper";
import { fetchCurrentFrontpage } from "@/zactions/frontpageActions";
export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => {
    const data = await fetchCurrentFrontpage();
    if (!data) throw notFound();
    return data;
  },
  head: () => ({
    meta: [
      { name: "My Site", content: "Front page of my site" },
      { title: "ECommerce Site" },
    ],
  }),
});

function Index() {
  const { products, categories } = Route.useLoaderData();

  return (
    <main>
      <LanderImageComponent />

      <LanderCategories categories={categories} />
      <MainWrapper>
        <LanderProducts products={products} />
      </MainWrapper>
    </main>
  );
}
