// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Input,
//   Button,
//   Select,
//   message,
//   Form,
//   Empty,
//   Rate,
//   Skeleton,
// } from "antd";
// import Comment from "./RenderComments";
// import { useSelector } from "react-redux";
// import { CommentStatus } from "@/utils/const";
// import CommonTypography from "@/components/shared/Typography";
// import {
//   addComment,
//   deleteComment,
//   updateCommentStatus,
//   fetchCommentsData,
// } from "@/utils/commentUtils";

// const { Option } = Select;

// const CommentsSection = ({ selectedDatabases, selectedDatabaseIds }) => {
//   const [commentsData, setCommentsData] = useState([]);
//   const [showAllReplies, setShowAllReplies] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [addCommentLoading, setAddCommentLoading] = useState(false);
//   const [inputForm] = Form.useForm();
//   const { userDetails } = useSelector((state) => state.auth);
//   const userId = userDetails?.data?.data?.id;
//   const selectedDatabaseId = Form.useWatch("databaseId", inputForm);

//   const selectedDatabaseName =
//     selectedDatabaseId && selectedDatabaseIds.includes(selectedDatabaseId)
//       ? selectedDatabases[selectedDatabaseIds.indexOf(selectedDatabaseId)]
//       : "";

//   const fetchComments = async (selectedDatabaseIds) => {
//     if (!selectedDatabaseIds || selectedDatabaseIds.length === 0) {
//       return;
//     }
//     try {
//       setLoading(true);
//       const data = await fetchCommentsData(selectedDatabaseIds);
//       if (data) {
//         setCommentsData(data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddComment = async (values) => {
//     const { comment, databaseId, rating } = values;

//     const payload = {
//       comment: comment,
//       databaseId: databaseId,
//       createdBy: userId,
//       ...(rating !== undefined && { rating }),
//     };

//     try {
//       setAddCommentLoading(true);
//       const response = await addComment(payload);
//       if (response.data) {
//         message.success("Comment added successfully");
//         fetchComments(selectedDatabaseIds);
//         inputForm.resetFields();
//       }
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       message.error(
//         error.message || "An error occurred while adding the comment"
//       );
//     } finally {
//       setAddCommentLoading(false);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     const payload = { commentId };

//     try {
//       const response = await deleteComment(payload);
//       if (response.message === "Comment deleted successfully") {
//         message.success("Comment or reply deleted successfully!");
//         fetchComments(selectedDatabaseIds);
//       }
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//       message.error("An error occurred while deleting the comment.");
//     }
//   };

//   const handleDisableComment = async (commentId, status) => {
//     const payload = {
//       id: commentId,
//       status: CommentStatus.INACTIVE,
//       updatedBy: userId,
//     };

//     try {
//       const response = await updateCommentStatus(payload);
//       if (response.data) {
//         message.success(
//           `Comment or reply ${
//             status === CommentStatus.INACTIVE ? "disabled" : "enabled"
//           } successfully!`
//         );
//         fetchComments(selectedDatabaseIds);
//       }
//     } catch (error) {
//       console.error("Error updating comment status:", error);
//       message.error(
//         "An error occurred while updating the comment or reply status."
//       );
//     }
//   };

//   const handleUndisableComment = async (commentId, status) => {
//     const payload = {
//       id: commentId,
//       status: CommentStatus.ACTIVE,
//       updatedBy: userId,
//     };

//     try {
//       const response = await updateCommentStatus(payload);
//       if (response.data) {
//         message.success(
//           `Comment or reply ${
//             status === CommentStatus.ACTIVE ? "undisabled" : "enabled"
//           } successfully!`
//         );
//         fetchComments(selectedDatabaseIds);
//       }
//     } catch (error) {
//       console.error("Error updating comment status:", error);
//       message.error(
//         "An error occurred while updating the comment or reply status."
//       );
//     }
//   };

//   const toggleShowAllReplies = (commentId, value) => {
//     setShowAllReplies((prev) => ({
//       ...prev,
//       [commentId]: value,
//     }));
//   };
//   useEffect(() => {
//     if (selectedDatabaseIds) {
//       fetchComments(selectedDatabaseIds);
//     }
//   }, [selectedDatabaseIds]);

//   return (
//     <div className="w-full lg:max-w-[75%] ">
//       <div className="flex flex-row items-center ">
//         <h2 className="text-2xl font-semibold">Comments</h2>
//         <div className="bg-[#3E53D7] rounded-xl w-14 flex items-center justify-center ml-2">
//           <span className="text-white">{commentsData.length}</span>
//         </div>
//       </div>

//       <Card className="w-full mt-6 rounded-xl p-2 md:p-3">
//         <div className="space-y-6">
//           <Form
//             onFinish={(values) => {
//               handleAddComment(values);
//             }}
//             layout="vertical"
//             form={inputForm}
//           >
//             <Form.Item
//               name="comment"
//               rules={[
//                 {
//                   max: 1000,
//                   message: "Comment cannot exceed 1000 characters!",
//                 },
//               ]}
//               className="mb-2"
//             >
//               <Input.TextArea
//                 autoSize={{ minRows: 2, maxRows: 4 }}
//                 placeholder="Add a comment"
//                 className="border-none focus:ring-0 focus:outline-none h-8"
//                 maxLength={1000}
//                 showCount
//               />
//             </Form.Item>

//             <div className="sm:flex items-center justify-between mt-8">
//               <div className="flex flex-col sm:flex-row">
//                 <Form.Item
//                   name="databaseId"
//                   rules={[
//                     { required: true, message: "Please select database!" },
//                   ]}
//                   className="m-0"
//                 >
//                   <Select
//                     placeholder="Select database"
//                     popupMatchSelectWidth={false}
//                     allowClear
//                     className="sm:max-w-40 md:max-w-full w-full mb-2 sm:mb-0"
//                   >
//                     {selectedDatabases?.map((db, idx) => (
//                       <Option key={idx} value={selectedDatabaseIds[idx]}>
//                         {db}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//                 <div className="flex items-center justify-between border border-[#D9D9D9] rounded-md px-2 sm:ml-2 h-8 ">
//                   <CommonTypography className="text-sm text-[#747474] font-normal opacity-50 pr-2 truncate max-w-32">
//                     Rate {selectedDatabaseName || "Db"}:
//                   </CommonTypography>
//                   <Form.Item className="!m-0 !p-0" name="rating">
//                     <Rate
//                       defaultValue={3}
//                       className="text-[#FFC412] !text-sm "
//                     />
//                   </Form.Item>
//                 </div>
//               </div>

//               <Button
//                 type="primary"
//                 className={`bg-[#3E53D7] text-white h-8 md:h-9 text-xs md:text-sm w-full sm:w-20 mt-2 sm:mt-0 ${
//                   addCommentLoading ? "sm:w-28" : ""
//                 } `}
//                 htmlType="submit"
//                 disabled={addCommentLoading}
//                 loading={addCommentLoading}
//               >
//                 Submit
//               </Button>
//             </div>
//           </Form>
//         </div>
//       </Card>

//       <div>
//         {loading ? (
//           <Skeleton active paragraph={{ rows: 3 }} className="pt-12" />
//         ) : commentsData === undefined || commentsData.length === 0 ? (
//           <Empty
//             image={Empty.PRESENTED_IMAGE_SIMPLE}
//             description="No comments"
//             className="pt-12"
//           />
//         ) : (
//           <div>
//             {commentsData.map((comment) => (
//               <Comment
//                 key={comment.id}
//                 comment={comment}
//                 level={0}
//                 selectedDatabases={selectedDatabases}
//                 selectedDatabaseIds={selectedDatabaseIds}
//                 showAllReplies={showAllReplies[comment.id] || false}
//                 toggleShowAllReplies={(value) =>
//                   toggleShowAllReplies(comment.id, value)
//                 }
//                 handleDeleteComment={(commentId, parentCommentId) =>
//                   handleDeleteComment(commentId, parentCommentId)
//                 }
//                 handleDisableComment={(commentId, parentCommentId) =>
//                   handleDisableComment(commentId, parentCommentId)
//                 }
//                 handleUndisableComment={(commentId, parentCommentId) =>
//                   handleUndisableComment(commentId, parentCommentId)
//                 }
//                 fetchComments={fetchComments}
//                 className="childreply"
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommentsSection;
