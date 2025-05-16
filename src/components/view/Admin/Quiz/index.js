"use client";

import React from "react";
import AdminLayout from "..";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "nextjs-toploader/app";
const Quiz = () => {
  const router = useRouter();
  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quizzes</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className=" text-white px-4 py-2 rounded-md"
          onClick={() => router.push("/admin/quiz/new")}
        >
          Create Quiz
        </Button>
      </div>
    </AdminLayout>
  );
};

export default Quiz;
