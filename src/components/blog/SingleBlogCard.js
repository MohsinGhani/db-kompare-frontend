"use client";
import Image from "next/image";
import Link from "next/link";
import { Avatar, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import editblogIcon from "@/../public/assets/icons/pencilIcon.svg";
const SingleBlogCard = ({ blog }) => {
  const { id, title, creator, content, date } = blog;

  const countAlphabets = (str) => {
    return str.replace(/[^A-Za-z]/g, "").length;
  };
  const truncatedContent =
    countAlphabets(content) > 180 ? `${content.slice(0, 180)}...` : content;

  return (
    <Card loading={!blog}>
      <Link href="#" className="relative block w-full">
        {/* <Link href={`/blog/${id}`} className="relative block w-full"> TODO : later we use this line instead of the above line */}

        <img
          src="https://technovans.com/wp-content/uploads/2019/05/top-12-blogging-tips-for-beginners.jpg"
          alt="Blog Post Image"
          style={{
            width: "100%",
            borderRadius: "10px 10px 0 0",
            height: "218px",
            objectFit: "cover",
          }}
        />

        <div className="absolute top-2 right-2  bg-primary p-2 rounded-full">
          <Image src={editblogIcon} width={25} height={25} />
        </div>
      </Link>
      <div className="p-3 sm:p-8 md:px-6 md:py-6 lg:p-4 xl:px-5 xl:py-4 2xl:px-8 2xl:pt-8 ">
        <Link
          href={`/blog/${id}`}
          // href="#"
          className=" line-clamp-2 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
        >
          <div className="flex flex-col gap-5">
            <h3>{title}</h3>
            <p className="text-base text-secondary font-normal mb-5">
              {truncatedContent}
            </p>
          </div>
        </Link>
        <div className="flex items-center pt-4 ">
          <div className="mr-5 flex items-center border-r border-[#7882931A] border-opacity-10 pr-5  xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
            <div className="mr-4">
              <Avatar
                className="bg-primary"
                icon={<UserOutlined />}
                size={48}
              />
            </div>
            <div className="w-full">
              <h4 className=" font-medium ">
                {creator?.name || "Unknown Author"}
              </h4>
            </div>
          </div>
          <div className="inline-block">
            <h4 className="mb-1 text-sm font-medium text-dark">Date</h4>
            <p className="text-xs text-[#788293]">{date}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SingleBlogCard;
