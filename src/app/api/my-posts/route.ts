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
    const offset = (page - 1) * limit;

    if (!type || !["forum", "transfer"].includes(type)) {
      return NextResponse.json(
        createErrorResponse("Invalid post type"),
        { status: 400 }
      );
    }

    let posts;
    let total;

    if (type === "forum") {
      // 포럼 게시글 조회
      total = await prisma.forum_posts.count({
        where: {
          userId: user.userId,
          deletedAt: null
        }
      });

      posts = await prisma.forum_posts.findMany({
        where: {
          userId: user.userId,
          deletedAt: null
        },
        include: {
          users: {
            select: {
              id: true,
              nickname: true,
              profileImage: true,
              userType: true,
              hospitalName: true,
              veterinarians: {
                select: {
                  nickname: true
                }
              },
              veterinary_students: {
                select: {
                  nickname: true
                }
              }
            }
          },
          _count: {
            select: {
              forum_comments: true,
              forum_post_likes: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: offset,
        take: limit
      });

      // 게시글 데이터 변환
      posts = posts.map((post: any) => {
        let displayName = post.users.nickname;
        
        if (post.users.userType === 'VETERINARIAN' && post.users.veterinarians) {
          displayName = post.users.veterinarians.nickname || post.users.nickname;
        } else if (post.users.userType === 'VETERINARY_STUDENT' && post.users.veterinary_students) {
          displayName = post.users.veterinary_students.nickname || post.users.nickname;
        } else if (post.users.userType === 'HOSPITAL') {
          displayName = post.users.hospitalName || post.users.nickname;
        }

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          animalType: post.animalType,
          medicalField: post.medicalField,
          viewCount: post.viewCount,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          commentCount: post._count.forum_comments,
          likeCount: post._count.forum_post_likes,
          user: {
            id: post.users.id,
            displayName,
            profileImage: post.users.profileImage,
            userType: post.users.userType
          }
        };
      });
    } else {
      // 양도양수 게시글 조회
      total = await prisma.transfers.count({
        where: {
          userId: user.userId,
          deletedAt: null,
        },
      });

      posts = await prisma.transfers.findMany({
        where: {
          userId: user.userId,
          deletedAt: null,
        },
        include: {
          users: {
            select: {
              id: true,
              nickname: true,
              profileImage: true,
              userType: true,
              hospitalName: true,
              hospital_specialties: {
                select: {
                  specialty: true,
                },
              },
            },
          },
          transfer_likes: {
            where: {
              userId: user.userId,
            },
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              transfer_likes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      });

      // 게시글 데이터 변환
      posts = posts.map((post: any) => {
        const displayName =
          post.users.hospitalName || post.users.nickname || "병원";
        const hospitalType =
          post.users.hospital_specialties?.[0]?.specialty || "";
        const isLiked = post.transfer_likes.length > 0;
        const imageUrl = post.images?.[0] || null;
        const isDraft = post.status !== "ACTIVE";

        return {
          id: post.id,
          title: post.title,
          description: post.description,
          location: post.location,
          price: post.price ? String(post.price) : null,
          categories: post.category,
          images: post.images,
          status: post.status,
          views: post.views,
          area: post.area ? Number(post.area) : null,
          base_address: post.base_address,
          detail_address: post.detail_address,
          sido: post.sido,
          sigungu: post.sigungu,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          likeCount: post._count.transfer_likes,
          user: {
            id: post.users.id,
            displayName,
            profileImage: post.users.profileImage,
            userType: post.users.userType,
          },
          hospitalType,
          isLiked,
          imageUrl,
          isDraft,
        };
      });
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      createApiResponse("success", "게시글 목록 조회 성공", {
        posts,
        total,
        page,
        limit,
        totalPages,
        type
      })
    );
  } catch (error) {
    console.error("My posts list error:", error);
    return NextResponse.json(
      createErrorResponse("게시글 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});