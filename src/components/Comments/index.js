"use client";

import React, { useState } from "react";
import { Input, Button, List, Typography, Divider, Modal, Space } from "antd";
import { DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const { TextArea } = Input;

const Comments = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      text: "This is the first comment",
      replies: [
        {
          id: 2,
          text: "This is a reply to the first comment",
          parentCommentId: 1,
        },
        {
          id: 3,
          text: "This is another reply to the first comment",
          parentCommentId: 1,
        },
      ],
    },
    {
      id: 4,
      text: "This is the second comment",
      replies: [
        {
          id: 5,
          text: "This is a reply to the second comment",
          parentCommentId: 4,
        },
      ],
    },
  ]);
  console.log("🚀 ~ comments:", comments);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [editedReplyText, setEditedReplyText] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentData = {
      id: new Date().getTime(),
      text: newComment,
      replies: [],
    };
    setComments([newCommentData, ...comments]);
    setNewComment("");
  };

  const handleAddReply = () => {
    if (!replyText.trim()) return;

    const replyData = {
      id: new Date().getTime(),
      text: replyText,
      parentCommentId: replyTo.id, // Associate with the parent comment
    };

    const updatedComments = comments.map((comment) =>
      comment.id === replyTo.id
        ? { ...comment, replies: [...comment.replies, replyData] }
        : comment
    );

    setComments(updatedComments);
    setReplyText("");
    setReplyTo(null);
  };

  const handleDeleteComment = (commentId) => {
    setIsDeleteModalVisible(true);
    setCommentIdToDelete(commentId);
  };

  const confirmDelete = () => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentIdToDelete
    );
    setComments(updatedComments);
    setIsDeleteModalVisible(false);
    setCommentIdToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setCommentIdToDelete(null);
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditedCommentText(comment.text);
  };

  const handleSaveCommentEdit = () => {
    if (editedCommentText.trim()) {
      const updatedComments = comments.map((comment) =>
        comment.id === editingComment.id
          ? { ...comment, text: editedCommentText }
          : comment
      );
      setComments(updatedComments);
      setEditingComment(null);
      setEditedCommentText("");
    }
  };

  const handleEditReply = (reply) => {
    setEditingReply(reply);
    setEditedReplyText(reply.text);
  };

  const handleSaveReplyEdit = () => {
    if (editedReplyText.trim()) {
      const updatedComments = comments.map((comment) => {
        if (comment.id === editingReply.parentCommentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === editingReply.id
                ? { ...reply, text: editedReplyText }
                : reply
            ),
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setEditingReply(null);
      setEditedReplyText("");
    }
  };

  const handleDeleteReply = (replyId, parentCommentId) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          replies: comment.replies.filter((reply) => reply.id !== replyId),
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const renderReplies = (replies, parentCommentId) => {
    return replies.map((reply) => (
      <div className="w-full flex flex-col gap-2 items-start" key={reply.id}>
        {editingReply && editingReply.id === reply.id ? (
          <div className="w-full flex flex-col gap-2 items-start">
            <Input
              value={editedReplyText}
              onChange={(e) => setEditedReplyText(e.target.value)}
            />
            <Space>
              <Button onClick={() => setEditingReply(null)}>Cancel</Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSaveReplyEdit}
              >
                Save
              </Button>
            </Space>
          </div>
        ) : (
          <>
            <Typography.Text>{reply.text}</Typography.Text>
            <div className="flex gap-4 items-center">
              <Button
                type="link"
                onClick={() => handleEditReply(reply)}
                icon={<EditOutlined />}
              >
                Edit
              </Button>
              <Button
                icon={<DeleteOutlined />}
                type="link"
                onClick={() => handleDeleteReply(reply.id, parentCommentId)}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
    ));
  };

  const renderComment = (comment) => (
    <div key={comment.id} className="w-full flex flex-col items-start gap-2">
      {editingComment && editingComment.id === comment.id ? (
        <div className="w-full flex flex-col gap-2 items-start">
          <Input
            value={editedCommentText}
            onChange={(e) => setEditedCommentText(e.target.value)}
          />
          <Space>
            <Button onClick={() => setEditingComment(null)}>Cancel</Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSaveCommentEdit}
            >
              Save
            </Button>
          </Space>
        </div>
      ) : (
        <>
          <Typography.Paragraph className="!mb-0">
            {comment.text}
          </Typography.Paragraph>
          <div className="flex gap-4 items-center">
            <Button
              type="link"
              onClick={() => {
                setReplyTo(comment);
                setReplyText("");
              }}
            >
              Reply
            </Button>
            <Button
              type="link"
              onClick={() => handleEditComment(comment)}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
            <Button
              icon={<DeleteOutlined />}
              type="link"
              onClick={() => handleDeleteComment(comment.id)}
            >
              Delete
            </Button>
          </div>
          {comment.replies.length > 0 && (
            <div className="ml-5 flex flex-col items-start gap-2">
              {renderReplies(comment.replies, comment.id)}
            </div>
          )}
        </>
      )}
      {replyTo && replyTo.id === comment.id && (
        <div className="w-full flex flex-col gap-2 items-start">
          <Input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
          />
          <Space>
            <Button onClick={() => setReplyTo(null)}>Cancel</Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleAddReply}
            >
              Reply
            </Button>
          </Space>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full p-5">
      <Typography.Title level={3}>Comments</Typography.Title>
      <Space.Compact style={{ width: "100%" }}>
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleAddComment}
        >
          Add Comment
        </Button>
      </Space.Compact>

      <Divider />

      {comments.length > 0 && (
        <List
          dataSource={comments}
          renderItem={(item) => <List.Item>{renderComment(item)}</List.Item>}
          itemLayout="horizontal"
          bordered
        />
      )}

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
      >
        <p>Are you sure you want to delete this comment?</p>
      </Modal>
    </div>
  );
};

export default Comments;
