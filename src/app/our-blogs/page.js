import OurBlogPage from "@/components/view/Blog/ourBlogPage";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

const title = "DB Internals";
const description =
  "DB-Kompare and DBTools-Kompare Blogging platform provides LATEST updates on the trends in DB and DBTools. Rating and Comments are provided to get you an unbiased view";

export const metadata = generateCommonMetadata({
  title,
  description,
});
export default function page() {
  return <OurBlogPage />;
}
