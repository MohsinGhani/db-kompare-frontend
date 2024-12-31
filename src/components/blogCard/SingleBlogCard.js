"use client";
import Link from "next/link";
import { Avatar, Card } from "antd";
import { getInitials } from "@/utils/getInitials";
import { usePathname } from "next/navigation";
import { formatReadableDate } from "@/utils/formatDateAndTime";

const SingleBlogCard = ({ blog }) => {
  const pathname = usePathname();
  const { id, title, description, createdAt } = blog;
  let author = blog?.createdBy?.name || "Unknown Author";
  const imageUrl = `${process.env.NEXT_PUBLIC_BUCKET_URL}/BLOG/${id}.webp`;

  const countAlphabets = (str) => str?.replace(/[^A-Za-z]/g, "")?.length;

  const truncatedContent = (() => {
    const textLength = countAlphabets(description);
    return textLength > 150
      ? description.slice(0, 150) + "..."
      : blog.description;
  })();

  return (
    <Card
      hoverable
      loading={!blog}
      style={{
        height: "100%",
      }}
      className="rounded-none"
    >
      <Link href={`/blog/${id}`} className="relative block w-full">
        <img
          src={imageUrl}
          alt="Blog Post Image"
          style={{
            width: "100%",
            height: "218px",
            objectFit: "cover",
          }}
        />
      </Link>

      <div className="p-3 h-[100%] sm:p-8 md:px-6 md:py-6 lg:p-4 xl:px-5 xl:py-4 2xl:px-8 2xl:pt-8 ">
        <Link
          href={`/blog/${id}`}
          className="block text-lg font-bold text-black hover:text-primary sm:text-2xl"
        >
          <h3>{title}</h3>
        </Link>
        <p
          className="text-base mt-5 text-secondary font-normal mb-5"
          dangerouslySetInnerHTML={{ __html: truncatedContent }}
        />

        <div className="flex items-center pt-4">
          <div className="mr-5 flex items-center border-r border-body-color border-opacity-10  dark:border-white dark:border-opacity-10 xl:mr-3 2xl:mr-5 2xl:pr-0">
            <div className="mr-4">
              <Avatar className="bg-primary text-white w-12 h-12 ">
                {getInitials(author)}
              </Avatar>
            </div>
            <div className="w-full">
              <h4 className=" font-medium ">{author || "Unknown Author"}</h4>
            </div>
          </div>
          <div className="inline-block border-l pl-5">
            <h4 className="mb-1 text-sm font-medium text-dark">Date</h4>
            <p className="text-xs text-[#788293]">
              {formatReadableDate(createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SingleBlogCard;
