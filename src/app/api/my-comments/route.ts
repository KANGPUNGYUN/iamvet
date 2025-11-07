import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const searchKeyword = searchParams.get("searchKeyword"); // Get searchKeyword
    const commentFilter = searchParams.get("commentFilter"); // Get commentFilter
    const offset = (page - 1) * limit;

    if (!type || !["forum", "lecture", "all"].includes(type)) {
      return NextResponse.json(
        createErrorResponse("Invalid comment type"),
        { status: 400 }
      );
    }

    let comments: any[] = [];
    let total = 0;

    const commonInclude = {
      users: {
        select: {
          id: true,
          nickname: true,
          profileImage: true,
          userType: true,
          hospitalName: true,
          veterinarians: {
            select: {
              nickname: true,
            },
          },
          veterinary_students: {
            select: {
              nickname: true,
            },
          },
        },
      },
    };

    const mapCommentData = (comment: any, commentType: "forum" | "lecture") => {
      let displayName = comment.users.nickname;

      if (
        comment.users.userType === "VETERINARIAN" &&
        comment.users.veterinarians
      ) {
        displayName =
          comment.users.veterinarians.nickname || comment.users.nickname;
      } else if (
        comment.users.userType === "VETERINARY_STUDENT" &&
        comment.users.veterinary_students
      ) {
        displayName =
          comment.users.veterinary_students.nickname || comment.users.nickname;
      } else if (comment.users.userType === "HOSPITAL") {
        displayName = comment.users.hospitalName || comment.users.nickname;
      }

      const baseComment = {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        type: commentType, // Add type here
        user: {
          id: comment.users.id,
          displayName,
          profileImage: comment.users.profileImage,
          userType: comment.users.userType,
        },
      };

      if (commentType === "forum") {
        return {
          ...baseComment,
          postId: comment.forum_id,
          postTitle: comment.forum_posts?.title || "삭제된 게시글",
          postDeleted: !!comment.forum_posts?.deletedAt,
        };
      } else {
        // lecture
        return {
          ...baseComment,
          lectureId: comment.lectureId,
          lectureTitle: comment.lectures?.title || "삭제된 강의",
          lectureDeleted: !!comment.lectures?.deletedAt,
        };
      }
    };

    if ((type === "forum" || type === "all") && commentFilter !== "lecture") {
      const forumComments = await prisma.forum_comments.findMany({
        where: {
          user_id: user.userId,
          deletedAt: null,
          ...(searchKeyword && {
            OR: [
              { content: { contains: searchKeyword, mode: "insensitive" } },
              { forum_posts: { title: { contains: searchKeyword, mode: "insensitive" } } },
            ],
          }),
        },
        include: {
          forum_posts: {
            select: {
              id: true,
              title: true,
              userId: true,
              deletedAt: true,
            },
          },
          ...commonInclude,
        },
        orderBy: {
          createdAt: "desc",
        },
        ...(type === "forum" && { skip: offset, take: limit }), // Apply pagination only if type is forum
      });

      comments.push(...forumComments.map((c) => mapCommentData(c, "forum")));
      total += await prisma.forum_comments.count({
        where: {
          user_id: user.userId,
          deletedAt: null,
          ...(searchKeyword && {
            OR: [
              { content: { contains: searchKeyword, mode: "insensitive" } },
              { forum_posts: { title: { contains: searchKeyword, mode: "insensitive" } } },
            ],
          }),
        },
      });
    }

    if ((type === "lecture" || type === "all") && commentFilter !== "forum") {
      const lectureComments = await prisma.lecture_comments.findMany({
        where: {
          userId: user.userId,
          deletedAt: null,
          ...(searchKeyword && {
            OR: [
              { content: { contains: searchKeyword, mode: "insensitive" } },
              { lectures: { title: { contains: searchKeyword, mode: "insensitive" } } },
            ],
          }),
        },
        include: {
          lectures: {
            select: {
              id: true,
              title: true,
              deletedAt: true,
            },
          },
          ...commonInclude,
        },
        orderBy: {
          createdAt: "desc",
        },
        ...(type === "lecture" && { skip: offset, take: limit }), // Apply pagination only if type is lecture
      });

      comments.push(...lectureComments.map((c) => mapCommentData(c, "lecture")));
      total += await prisma.lecture_comments.count({
        where: {
          userId: user.userId,
          deletedAt: null,
          ...(searchKeyword && {
            OR: [
              { content: { contains: searchKeyword, mode: "insensitive" } },
              { lectures: { title: { contains: searchKeyword, mode: "insensitive" } } },
            ],
          }),
        },
      });
    }

    // If type is "all", sort and paginate the combined results
    if (type === "all") {
      const sortByParam = searchParams.get("sortBy");
      comments.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortByParam === "oldest" ? dateA - dateB : dateB - dateA;
      });

      comments = comments.slice(offset, offset + limit);
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      createApiResponse("success", "댓글 목록 조회 성공", {
        comments,
        total,
        page,
        limit,
        totalPages,
        type
      })
    );
  } catch (error) {
    console.error("My comments list error:", error);
    return NextResponse.json(
      createErrorResponse("댓글 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});