// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Avatar,
//   Button,
//   Dropdown,
//   Input,
//   Tag,
//   message,
//   Form,
//   Popconfirm,
//   Rate,
//   Card,
// } from "antd";
// import CommonTypography from "@/components/shared/Typography";
// import { getInitials } from "@/utils/getInitials";
// import "./tree-view.scss";
// import { useSelector } from "react-redux";
// import { CommentStatus } from "@/utils/const";
// import { formatRelativeTime } from "@/utils/formatDateAndTime";
// import { addComment, updateComment } from "@/utils/commentUtils";

// const Comment = ({
//   comment,
//   level,
//   fetchComments,
//   showAllReplies,
//   toggleShowAllReplies,
//   handleDeleteComment,
//   handleDisableComment,
//   handleUndisableComment,
//   selectedDatabases,
//   selectedDatabaseIds,
//   className,
// }) => {
//   const [showEditInput, setShowEditInput] = useState(false);
//   const [showAddReplyInput, setShowAddReplyInput] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [addReplyForm] = Form.useForm();
//   const [editReplyForm] = Form.useForm();
//   const editInputRef = useRef(null);
//   const { userDetails } = useSelector((state) => state.auth);
//   const userId = userDetails?.data?.data?.id;
//   const userName = userDetails?.data?.data?.name;

//   const databaseName =
//     selectedDatabases && selectedDatabaseIds
//       ? selectedDatabaseIds.includes(comment.databaseId)
//         ? selectedDatabases[selectedDatabaseIds.indexOf(comment.databaseId)]
//         : ""
//       : "";

//   const items = [
//     {
//       key: "edit",
//       label: "Edit",
//     },
//     ...(level === 0
//       ? [
//           {
//             key: comment.status === CommentStatus.ACTIVE ? "disable" : "enable",
//             label:
//               comment.status === CommentStatus.INACTIVE ? "Enable" : "Disable",
//           },
//         ]
//       : []),
//     {
//       key: "delete",
//       label: (
//         <Popconfirm
//           title="Are you sure you want to delete this comment?"
//           onConfirm={() =>
//             handleDeleteComment(comment.id, comment.parentCommentId || null)
//           }
//           okText="Yes"
//           cancelText="No"
//         >
//           <span className="text-red-500">Delete</span>
//         </Popconfirm>
//       ),
//     },
//   ];

//   const handleMenuClick = (key) => {
//     if (key === "edit") {
//       setShowEditInput(true);
//       editReplyForm.setFieldsValue({
//         id: comment.id,
//         editText: comment.comment,
//       });
//     } else if (key === "disable") {
//       handleDisableComment(comment.id, comment.parentCommentId || null);
//     } else if (key === "enable") {
//       handleUndisableComment(comment.id, comment.parentCommentId || null);
//     }
//   };

//   const addReply = async (replyData, rating) => {
//     const { text, parentCommentId, createdBy } = replyData;

//     const payload = {
//       comment: text,
//       repliedTo: parentCommentId,
//       createdBy: createdBy,
//       ...(rating !== undefined && { rating }),
//     };

//     try {
//       setLoading(true);
//       const response = await addComment(payload);

//       if (response.data) {
//         message.success("Reply added successfully!");
//         fetchComments(selectedDatabaseIds);
//       }
//     } catch (error) {
//       console.error("Error adding reply:", error);
//       message.error(
//         error.message || "An error occurred while adding the reply"
//       );
//     } finally {
//       addReplyForm.resetFields();
//       setLoading(false);
//       setShowAddReplyInput(false);
//     }
//   };

//   const handleAddReply = (values) => {
//     const { reply, rating } = values;
//     if (!reply.trim()) {
//       message.error("Please enter a reply.");
//       return;
//     }

//     const newReplyData = {
//       createdBy: userId,
//       text: reply.trim(),
//       replies: [],
//       parentCommentId: comment.id,
//     };
//     addReply(newReplyData, rating);
//   };

//   const editCommentOrReply = async (id, newText, isReply = false, rating) => {
//     const payload = {
//       id: id,
//       comment: newText,
//       ...(rating !== undefined && { rating }),
//     };

//     try {
//       setLoading(true);
//       const response = await updateComment(payload);

//       if (response.data) {
//         fetchComments(selectedDatabaseIds);
//         message.success(
//           `${isReply ? "Reply" : "Comment"} updated successfully!`
//         );
//       }
//     } catch (error) {
//       console.error("Error editing comment or reply:", error);
//       message.error("An error occurred while updating the comment or reply.");
//     } finally {
//       setLoading(false);
//       setShowEditInput(false);
//     }
//   };

//   const handleEdit = (values) => {
//     const rating = values.rating;
//     const newText = values.editText.trim();

//     if (!newText) {
//       message.error("Please enter text.");
//       return;
//     }

//     if (level === 0) {
//       editCommentOrReply(values.id, newText, false, rating);
//     } else {
//       editCommentOrReply(values.id, newText, true, rating);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         editInputRef.current &&
//         !editInputRef.current.contains(event.target)
//       ) {
//         setShowEditInput(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="treeview">
//       <ul className="cmnt-tree">
//         {level === 0 && (
//           <div className="bg-[#D9D9D9] h-[1px] w-full opacity-70 my-5"></div>
//         )}
//         <li className="cmnt-tree-child">
//           <div className=""></div>
//           <div className={` ${level > 0 ? "pl-0" : ""}`}>
//             <div className=" relative flex items-start">
//               <Avatar
//                 className={`bg-[#F6F6FF] text-[#3E53D7] rounded-full p-[18px] mr-1 mt-[2px] ${
//                   comment.status === CommentStatus.INACTIVE
//                     ? "opacity-70 cursor-default"
//                     : ""
//                 }`}
//               >
//                 {getInitials(comment.createdBy.name)}
//               </Avatar>

//               <div ref={editInputRef} className="w-full ml-2">
//                 {showEditInput ? (
//                   <div className="flex flex-row items-end">
//                     <div className="w-full">
//                       <p className="text-xs text-[#3E53D7] font-normal bg-[#F6F6FF] py-1 px-4 rounded-md inline-block">
//                         Editing
//                       </p>
//                       <Card className="w-full rounded-xl p-1 sm:p-2 h-auto">
//                         <Form
//                           layout="inline"
//                           onFinish={handleEdit}
//                           className="w-full"
//                           form={editReplyForm}
//                         >
//                           <Form.Item name="id" hidden></Form.Item>
//                           <div className="w-full justify-between items-center">
//                             <Form.Item
//                               name="editText"
//                               rules={[
//                                 {
//                                   required: true,
//                                   message: "Please enter updated text!",
//                                 },
//                               ]}
//                               className="w-full m-0 sm:px-2 sm:py-1 pb-2 sm:pb-0"
//                             >
//                               <Input.TextArea
//                                 autoSize={{ minRows: 2, maxRows: 4 }}
//                                 placeholder="Edit your comment"
//                                 className="flex-1 resize-none border-none focus:ring-0 focus:outline-none rounded-lg h-8 mb-4 text-xs sm:text-sm"
//                                 maxLength={1000}
//                                 showCount
//                               />
//                             </Form.Item>
//                             <div className="w-full flex flex-row justify-between mt-1 sm:mt-3 ">
//                               <div className="flex items-center border border-[#D9D9D9] rounded-md px-2 h-8 sm:ml-2">
//                                 <CommonTypography className="text-sm text-[#747474] font-normal opacity-50 pr-2 hidden sm:block">
//                                   Rate Db:
//                                 </CommonTypography>
//                                 <Form.Item className="!p-0 !m-0 " name="rating">
//                                   <Rate
//                                     defaultValue={3}
//                                     className="text-[#FFC412] !text-sm"
//                                   />
//                                 </Form.Item>
//                               </div>

//                               <Form.Item>
//                                 <Button
//                                   className="-mr-2 sm:mr-0"
//                                   type="text"
//                                   htmlType="submit"
//                                   disabled={loading}
//                                   loading={loading}
//                                   icon={
//                                     <img
//                                       src="/assets/icons/send-icon.svg"
//                                       className="w-4 h-4 cursor-pointer "
//                                       alt="Send Icon"
//                                     />
//                                   }
//                                 />
//                               </Form.Item>
//                             </div>
//                           </div>
//                         </Form>
//                       </Card>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="flex flex-row justify-between items-center">
//                       <div className="flex flex-col">
//                         <CommonTypography
//                           className={`font-semibold text-[13px] md:text-sm capitalize mb-1 ${
//                             comment.status === CommentStatus.INACTIVE
//                               ? "text-gray-400 cursor-default"
//                               : ""
//                           }`}
//                         >
//                           {comment.createdBy.name}
//                         </CommonTypography>
//                         <CommonTypography
//                           className={`!font-normal !text-xs opacity-70 ${
//                             comment.status === CommentStatus.INACTIVE
//                               ? "text-gray-400 cursor-default"
//                               : ""
//                           }`}
//                         >
//                           {formatRelativeTime(comment.createdAt)}
//                           <div className="-mt-1 rate-container">
//                             <Rate
//                               disabled
//                               value={comment.rating}
//                               className={`text-[#FFC412] !text-[11px] ${
//                                 comment.status === CommentStatus.INACTIVE
//                                   ? "cursor-default opacity-50"
//                                   : ""
//                               }`}
//                             />
//                           </div>
//                         </CommonTypography>
//                       </div>
//                       <div className="flex flex-row items-center">
//                         {level === 0 && (
//                           <Tag
//                             className={`!text-white bg-[#3E53D7] border-none !font-normal !text-[10px] py-[2px] px-3 rounded-xl hidden md:block ${
//                               comment.status === CommentStatus.INACTIVE
//                                 ? "opacity-70 cursor-default"
//                                 : ""
//                             }`}
//                           >
//                             {databaseName}
//                           </Tag>
//                         )}
//                         {userDetails && (
//                           <Dropdown
//                             menu={{
//                               items: items.map((item) => ({
//                                 ...item,
//                                 onClick: () => handleMenuClick(item.key),
//                               })),
//                             }}
//                             trigger={["click"]}
//                             placement="bottom"
//                             arrow={{ pointAtCenter: true }}
//                           >
//                             <img
//                               src="/assets/icons/dropdown-icon.svg"
//                               width={25}
//                               height={25}
//                               alt="Dropdown Icon"
//                               className="ml-2 cursor-pointer hover:opacity-70"
//                             />
//                           </Dropdown>
//                         )}
//                       </div>
//                     </div>

//                     <p
//                       className={`font-normal text-xs md:text-sm text-black my-2 ${
//                         comment.status === CommentStatus.INACTIVE
//                           ? "text-gray-400 cursor-default"
//                           : ""
//                       }`}
//                     >
//                       {comment.comment}
//                     </p>

//                     {level === 0 && (
//                       <div className="custom-button mb-5">
//                         <Button
//                           icon={
//                             <img
//                               src="/assets/icons/reply-icon.svg"
//                               alt="icon"
//                               className="w-4 h-4"
//                             />
//                           }
//                           className="bg-[#FAFAFA] text-[#565758] rounded-2xl font-normal text-sm border-none w-18 h-8 flex items-center justify-center"
//                           onClick={() => {
//                             setShowAddReplyInput(!showAddReplyInput);
//                           }}
//                           disabled={comment.status === CommentStatus.INACTIVE}
//                         >
//                           Reply
//                         </Button>
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {comment.replies && comment.replies.length > 0 && (
//                   <ul className="cmnt-tree">
//                     {comment.replies
//                       .slice(0, showAllReplies ? comment.replies.length : 2)
//                       .map((reply, index) => (
//                         <li
//                           className={`cmnt-tree-child ${className}`}
//                           key={reply.id}
//                         >
//                           <Comment
//                             comment={reply}
//                             level={level + 1}
//                             showAllReplies={showAllReplies[reply.id] || false}
//                             toggleShowAllReplies={(value) =>
//                               toggleShowAllReplies(reply.id, value)
//                             }
//                             handleDeleteComment={(replyId, parentId) =>
//                               handleDeleteComment(replyId, parentId)
//                             }
//                             handleDisableComment={(replyId, parentId) =>
//                               handleDisableComment(replyId, parentId)
//                             }
//                             handleUndisableComment={(replyId, parentId) =>
//                               handleUndisableComment(replyId, parentId)
//                             }
//                             fetchComments={() =>
//                               fetchComments(selectedDatabaseIds)
//                             }
//                           />
//                           {index ===
//                             comment.replies.slice(
//                               0,
//                               showAllReplies ? comment.replies.length : 2
//                             ).length -
//                               1 &&
//                             comment.replies.length > 2 && (
//                               <CommonTypography
//                                 type="text"
//                                 className="text-[#3E53D7] ml-[72px] mt-2 underline border-none shadow-none cursor-pointer"
//                                 onClick={() =>
//                                   toggleShowAllReplies(!showAllReplies)
//                                 }
//                               >
//                                 {showAllReplies
//                                   ? "Load Less Replies"
//                                   : "Load More Replies"}
//                               </CommonTypography>
//                             )}
//                         </li>
//                       ))}
//                   </ul>
//                 )}
//               </div>
//             </div>
//           </div>
//         </li>
//         {showAddReplyInput && (
//           <div className="sm:pl-14 mx-0 md:mx-3 mt-4 flex flex-row items-start">
//             <Avatar className="bg-[#F6F6FF] text-[#3E53D7] rounded-full p-[18px] mr-[6px] mt-[2px] opacity-70 cursor-default">
//               {getInitials(userName)}
//             </Avatar>
//             <div className="w-full ml-2">
//               <p className="text-xs text-[#3E53D7] font-normal bg-[#F6F6FF] py-1 px-4 rounded-md md:inline-block hidden">
//                 Replying to {comment.createdBy.name}
//               </p>
//               <p className="text-xs text-[#3E53D7] font-normal bg-[#F6F6FF] py-1 px-4 rounded-md inline-block md:hidden">
//                 Replying
//               </p>
//               <Card className="w-full rounded-xl p-1 sm:p-2">
//                 <Form
//                   layout="inline"
//                   onFinish={handleAddReply}
//                   className="w-full"
//                   form={addReplyForm}
//                 >
//                   <Form.Item
//                     name="reply"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please add a reply!",
//                       },
//                     ]}
//                     className="w-full m-0 sm:px-2 sm:py-1 pb-2 sm:pb-0"
//                   >
//                     <Input.TextArea
//                       autoSize={{ minRows: 2, maxRows: 4 }}
//                       maxLength={1000}
//                       showCount
//                       placeholder="Add a reply"
//                       className="px-1 border rounded-lg border-none focus:ring-0 focus:outline-none h-8 mb-2"
//                     />
//                   </Form.Item>
//                   <div className="w-full flex flex-row justify-between mt-2 sm:mt-3">
//                     <div className="flex items-center border border-[#D9D9D9] rounded-md px-2 h-8 sm:ml-2">
//                       <CommonTypography className="text-sm text-[#747474] font-normal opacity-50 pr-2 hidden sm:nlock">
//                         Rate Db:
//                       </CommonTypography>
//                       <Form.Item className="!p-0 !m-0 " name="rating">
//                         <Rate
//                           defaultValue={3}
//                           className="text-[#FFC412] !text-sm"
//                         />
//                       </Form.Item>
//                     </div>

//                     <Form.Item>
//                       <Button
//                         className="-mr-2 sm:mr-0"
//                         type="text"
//                         htmlType="submit"
//                         disabled={loading}
//                         loading={loading}
//                         icon={
//                           <img
//                             src="/assets/icons/send-icon.svg"
//                             className="w-4 h-4 cursor-pointer"
//                             alt="Send Icon"
//                           />
//                         }
//                       />
//                     </Form.Item>
//                   </div>
//                 </Form>
//               </Card>
//             </div>
//           </div>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default Comment;
