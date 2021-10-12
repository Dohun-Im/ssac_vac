const user = require("../models/user");
const sc = require("../modules/statusCode");
const jwtModule = require("../modules/jwtModule");
const post = require("../models/post");

const PostController = {
  createPost: async (req, res) => {
    const userInfo = req.userInfo;
    const { title, content, category, tags } = req.body;

    const postModel = new post({
      title,
      content,
      category,
      tags,
      publishedDate: new Date(),
      writer: userInfo._id,
    });

    try {
      const result = await postModel.save();
      res.status(200).json({
        message: " 게시 완료",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: " DB 서버 에러",
      });
    }
  },

  readAllPost: async (req, res) => {
    try {
      const allPost = await post.find().populate("writer", "nickName");
      if (!allPost)
        return res
          .status(400)
          .json({ message: "게시물을 조회할 수 없습니다." });

      res.status(sc.OK).json({
        message: "게시물 전체 조회 성공",
        data: allPost,
      });
    } catch (error) {
      res.status(500).json({
        message: "DB 서버 에러",
      });
    }
  },

  readDetailPost: async (req, res) => {
    const { id } = req.params;

    try {
      const detailPost = await post.findById(id).populate("writer", "nickName");
      if (!detailPost)
        return res
          .status(400)
          .json({ message: "조회 할 게시물이 존재하지 않습니다." });

      res.status(sc.OK).json({
        messgae: "해당 게시물 조회 성공",
        data: detailPost,
      });
    } catch (error) {
      res.status(500).json({
        message: "DB 서버 에러",
      });
    }
  },

  updatePost: async (req, res) => {
    const { id } = req.params;

    const isSameWriter = await post.checkWriter({
      postId: id,
      writerId: userInfo._id,
    });
    if (isSameWriter === -1) {
      return res.status(409).json({ message: "권한이 없습니다." });
    } else if (isSameWriter === -2) {
      return res.status(500).json({ message: "DB 서버 에러" });
    } else {
      const { title, content, category, tags } = req.body;
      try {
        const updated = await post.findByIdAndUpdate(
          id,
          {
            title,
            content,
            category,
            tags,
            updatedDate: new Date(),
          },
          { new: true }
        );
        res.status(sc.OK).json({
          message: "게시물 수정 성공",
          data: updated,
        });
      } catch (error) {
        res.status(500).json({
          message: "게시물 수정 실패",
          error: error,
        });
      }
    }
  },

  readRelatedPost: async function (req, res) {
    const { writerId } = req.params;
    try {
      const result = await post
        .find({ writer: writerId })
        .populate("writer", "nickName");
      if (result) {
        return res.status(200).json({
          message: "조회 성공",
          data: result,
        });
      } else {
        return res.status(400).json({
          message: "해당 id의 게시글이 존재하지 않습니다",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "조회 실패",
        error: error,
      });
    }
  },

  deletePost: async (req, res) => {
    const userInfo = req.userInfo;
    const { id } = req.params;

    const check = await post.checkWriter({
      postId: id,
      writerId: userInfo._id,
    });
    if (check === -1) {
      return res.status(409).json({ message: "권한이 없습니다." });
    } else if (check === -2) {
      return res.status(500).json({ message: "DB 서버 에러" });
    } else {
      try {
        await post.findByIdAndDelete(id);
        res.status(sc.OK).json({
          message: "게시물 삭제 성공",
        });
      } catch (error) {
        res.status(500).json({
          message: "DB 서버 에러",
        });
      }
    }
  },

  createComment: async (req, res) => {
    const userInfo = req.userInfo;
    const { content } = req.body;
    const { id } = req.params;

    const newComment = {
      commentWriter: userInfo._id,
      commentContent: content,
      commnetDate: new Date(),
    };
    try {
      const updated = await post.findByIdAndUpdate(
        id,
        { $push: { comments: newComment } },
        { new: true }
      );
      res.status(sc.OK).json({
        message: "댓글 추가 완료",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({
        message: "DB 서버 에러",
      });
    }
  },

  deleteComment: async (req, res) => {
    const userInfo = req.userInfo;
    const postId = req.params.id;
    const commentId = req.params.commentid;

    const isSameWriter = await post.checkComment({
      postId: postId,
      commnetId: commentId,
      writerId: userInfo._id,
    });

    if (isSameWriter === -1) {
      return res.status(409).json({ message: "권한이 없습니다." });
    } else if (isSameWriter === -2) {
      return res.status(500).json({ message: "DB 서버 에러" });
    } else if (isSameWriter === 1) {
      try {
        const updated = await post.findByIdAndUpdate(
          //findByIdAndDelete 아님@!!@!@
          postId,
          { $pull: { comments: { _id: commentId } } },
          { new: true }
        );
        res.status(sc.OK).json({
          message: "댓글 삭제 완료",
        });
      } catch (error) {
        res.status(500).json({
          message: "DB 서버 에러",
        });
        console.log(error);
      }
    }
  },

  updateComment: async (req, res) => {
    const userInfo = req.userInfo;
    const postId = req.params.id;
    const commentId = req.params.commentid;

    const isSameWriter = await post.checkComment({
      postId: postId,
      commnetId: commentId,
      writerId: userInfo._id,
    });
    if (isSameWriter === -1) {
      return res.status(409).json({ message: "권한이 없습니다." });
    } else if (isSameWriter === -2) {
      return res.status(500).json({ message: "DB 서버 에러" });
    } else if (isSameWriter === 1) {
      try {
        const updated = await post.findOneAndUpdate(
          { _id: postId, "comments._id": commentId },
          {
            $set: {
              "comment.$.commentContent": content,
              "comments.$.commentDate": new Date(),
            },
          },
          { new: true }
        );
        res.status(sc.OK).json({
          message: "댓글 수정 완료",
          data: updated,
        });
      } catch (error) {
        res.status(500).json({
          message: "DB 서버 에러",
        });
      }
    }
  },
};

module.exports = PostController;
