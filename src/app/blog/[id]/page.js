import BlogDetail from "@/components/view/BlogDetail";
import { fetchBlogById } from "@/utils/blogUtil";
import { convertHtmlToText, generateCommonMetadata } from "@/utils/helper";

async function getBlogData(id) {
  const response = await fetchBlogById(id);
  return response.data;
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const blog = await getBlogData(id);
  const textContent = convertHtmlToText(blog?.description) || "";

  const maxChars = 400;
  const truncatedParagraph =
    textContent.length > maxChars
      ? textContent.slice(0, maxChars).trim() + "..."
      : textContent;

  return generateCommonMetadata({
    title: blog?.title || "Blog",
    description: truncatedParagraph,
    imageUrl: `${process.env.NEXT_PUBLIC_BUCKET_URL}/BLOG/${id}.webp`,
    siteName: "DB Kompare",
    type: "article",
  });
}

const blogDetailsPage = async ({ params }) => {
  const { id } = params;
  return <BlogDetail id={id} />;
};

export default blogDetailsPage;
