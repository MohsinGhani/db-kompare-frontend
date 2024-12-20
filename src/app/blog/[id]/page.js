import BlogDetail from "@/components/view/BlogDetail";
export default function index({ params }) {
  const { id } = params;
  return <BlogDetail id={id} />;
}
