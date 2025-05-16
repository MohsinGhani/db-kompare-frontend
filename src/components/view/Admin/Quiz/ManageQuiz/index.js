"use client";

import React from "react";
import AdminLayout from "../..";
import CommonInput from "@/components/shared/CommonInput";
import CustomSelect from "@/components/shared/CustomSelect";

const ManageQuiz = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Create Quiz</h1>
      <div className="mt-6 flex flex-col gap-6  max-w-[80%]">
        <ContentBox>
          <div className="flex items-center gap-4">
            <CommonInput label="Name" placeholder="Enter name here." />
            <CommonInput
              label="Passing Perc (%)"
              placeholder="Enter passing percentage here."
            />
          </div>
          <div className="flex items-center gap-4">
            <CustomSelect
              className="w-1/2"
              options={[]}
              placeholder="Please select a category."
            />
            <CustomSelect
              className="w-1/2"
              options={[]}
              placeholder="Please select difficulty level."
            />
          </div>
          <CommonInput
            label="Short Description"
            placeholder="Enter short description here."
          />
        </ContentBox>

        <ContentBox>
          <p className="text-xl">Questions 1</p>
          <CommonInput label={"Question"} placeholder="Enter question here" />
        </ContentBox>
      </div>
    </AdminLayout>
  );
};

export default ManageQuiz;

const ContentBox = ({ children }) => {
  return <div className="bg-white border rounded-lg p-6">{children}</div>;
};
