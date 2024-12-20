"use client";

import CommonTypography from "@/components/shared/Typography";
import "./customCollapse.scss";
import { useSelector } from "react-redux";

const API_BASE_URL_1 = process.env.NEXT_PUBLIC_API_BASE_URL_1;

const UserProfile = () => {
  const [userData, setUserData] = useState();
  const { userDetails } = useSelector((state) => state.auth);
  const userId = userDetails?.data?.data?.id;
  const Y_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;

  const fetchUserDetails = async () => {
    if (!userId) {
      console.warn("User ID is undefined. Skipping fetch.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL_1}/get-user?id=${userId}`, {
        method: "GET",
        headers: {
          "x-api-key": Y_API_KEY,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(data);
      } else if (response.status === 404) {
        console.warn("User not found.");
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const items = [
    {
      key: "1",
      label: "Profile",
      children: <UserProfileForm />,
    },
    {
      key: "2",
      label: "My Blogs",
      children: (
        <Blog
          route="/add-blog"
          text="Blogs"
          buttonText="Add Blog"
          secondText=" Edit and manage your blogs"
        />
      ),
    },
  ];

  return (
    <div className="container py-32">
      <div className="flex flex-col mb-5">
        <CommonTypography type="title">
          {activeKey === "1" ? "Profile" : "Blog"}
        </CommonTypography>
        <CommonTypography classes="text-[#565758] text-base">
          Edit and manage your {activeKey === "1" ? "Profile" : "Blog"}
        </CommonTypography>
      </div>
      <Tabs activeKey={activeKey} items={items} onChange={onChange} />
    </div>
  );
};
