"use client";
import Image from "next/image";
import Link from "next/link";
import { Avatar, Card } from "antd";
import editblogIcon from "@/../public/assets/icons/pencilIcon.svg";
import { getInitials } from "@/utils/getInitials";
import { usePathname } from "next/navigation";
import { formatReadableDate } from "@/utils/formatDateAndTime";

const SingleBlogCard = ({ blog }) => {
  const pathname = usePathname();
  const { id, title, description, createdAt, imageUrl } = blog;
  let author = blog?.createdBy?.name || "Unknown Author";

  const countAlphabets = (str) => str.replace(/[^A-Za-z]/g, "").length;

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
    >
      <Link href={`/blog/${id}`} className="relative block w-full">
        <img
          src={imageUrl}
          alt="Blog Post Image"
          style={{
            width: "100%",
            borderRadius: "10px 10px 0 0",
            height: "218px",
            objectFit: "cover",
          }}
        />
      </Link>
      {pathname === "/user-profile" || pathname === "/blog" ? (
        <Link
          href={`/edit-blog/${id}`}
          className="absolute top-2 right-2 bg-primary p-2 rounded-full"
        >
          <Image
            src={editblogIcon}
            width={20}
            height={20}
            alt="Edit Icon"
            className="hover:w-6 hover:h-6  transition-all"
          />
        </Link>
      ) : null}

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
          <div className="mr-5 flex items-center border-r border-body-color border-opacity-10 pr-5 dark:border-white dark:border-opacity-10 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
            <div className="mr-4">
              <Avatar className="bg-primary text-white w-9 h-9 ">
                {getInitials(author)}
              </Avatar>
            </div>
            <div className="w-full">
              <h4 className=" font-medium ">{author || "Unknown Author"}</h4>
            </div>
          </div>
          <div className="inline-block">
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
