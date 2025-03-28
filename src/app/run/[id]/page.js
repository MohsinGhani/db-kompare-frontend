import RunSQL from "@/components/view/RunSQL";
import React from "react";

const page = async ({ params }) => {
  const { id } = params;
  return <RunSQL fiddleId={id} />;
};

export default page;
