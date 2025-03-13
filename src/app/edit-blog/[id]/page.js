import EditBlog from "@/components/editBlog";
import { generateCommonMetadata } from "@/utils/helper";

const title = "Edit DB Blog";
const description =
  "Edit and update your existing database-related blog content on DB Kompare. Refine your articles, add new insights, or make changes to ensure your content is up-to-date and helpful for the community. Whether you're enhancing performance optimization tips or providing new database migration techniques, the Edit Blog page lets you keep your contributions fresh and relevant.";

export const metadata = generateCommonMetadata({
  title,
  description,
});
export default function EditBlogPage() {
  return <EditBlog />;
}
