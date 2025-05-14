// src/api/posts.js
import img1 from "@/assets/1080-600x500.jpg";
import img2 from "@/assets/1084-600x280.jpg";
import img3 from "@/assets/115-600x300.jpg";
import img4 from "@/assets/180-600x360.jpg";
import img5 from "@/assets/259-600x240.jpg";
import img6 from "@/assets/26-600x490.jpg";
import img7 from "@/assets/27-600x250.jpg";
import img8 from "@/assets/327-600x330.jpg";
import img9 from "@/assets/353-600x450.jpg";
import img10 from "@/assets/355-600x200.jpg";
import img11 from "@/assets/380-600x400.jpg";
import img12 from "@/assets/399-600x440.jpg";
import img13 from "@/assets/40-600x470.jpg";
import img14 from "@/assets/452-600x270.jpg";
import img15 from "@/assets/537-600x310.jpg";
import img16 from "@/assets/656-600x480.jpg";
import img17 from "@/assets/722-600x380.jpg";
import img18 from "@/assets/815-600x220.jpg";
import img19 from "@/assets/966-600x350.jpg";
import img20 from "@/assets/20.jpg";
import img21 from "@/assets/21.jpg";
import img22 from "@/assets/22.jpg";
import img23 from "@/assets/23.jpg";
import img24 from "@/assets/24.jpg";
import img25 from "@/assets/25.jpg";
import img26 from "@/assets/26.jpg";
import img27 from "@/assets/27.jpg";
import img28 from "@/assets/28.jpg";
import img29 from "@/assets/29.jpg";
import img30 from "@/assets/30.jpg";
import img31 from "@/assets/31.jpg";
import img32 from "@/assets/32.jpg";
import img33 from "@/assets/33.jpg";
import img34 from "@/assets/34.jpg";
import img35 from "@/assets/35.jpg";
import img36 from "@/assets/36.jpg";
import img37 from "@/assets/37.jpg";
import img38 from "@/assets/38.jpg";
import img39 from "@/assets/39.jpg";
import img40 from "@/assets/40.jpg";
// 小型视频 URL 列表（真实可用的小型视频）
export const getRandomVideoUrl = () => {
  const videoUrls = [
    // 自然风景类
    "https://prod-streaming-video-msn-com.akamaized.net/a8c412fa-f696-4ff2-9c76-e8ed9cdffe0f/604a87fc-e7bc-463e-8d56-cde7e661d690.mp4", // 湖面雨滴 (1.5MB)
    "https://prod-streaming-video-msn-com.akamaized.net/ba258271-89c7-47bc-9742-bcae67c23202/f7ff4fe4-1346-47bb-9466-3f4662c1ac3a.mp4", // 阳光森林溪流 (1.8MB)
    "https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4", // 日落沙丘 (2.1MB)

    // 城市生活类
    "https://prod-streaming-video-msn-com.akamaized.net/0b927d99-e38a-4f51-8d1a-598fd4d6ee97/3493c85c-f35a-488f-9a8f-633e747fb141.mp4", // 机场行人 (2.3MB)
    "https://prod-streaming-video-msn-com.akamaized.net/bc3e9341-3243-4d2c-8469-940fef56ca2d/4720a02b-eabd-4593-a1d9-5c5d61916853.mp4", // 咖啡机 (1.7MB)

    // 抽象/动画类
    "https://prod-streaming-video-msn-com.akamaized.net/35960fe4-724f-44fc-ad77-0b91c55195e4/bfd49cd7-a0c6-467e-ae34-8674779e689b.mp4", // 数字城市地图 (1.9MB)
    "https://prod-streaming-video-msn-com.akamaized.net/178161a4-26a5-4f84-96d3-6acea1909a06/2213bcd0-7d15-4da0-a619-e32d522572c0.mp4", // 抽象流动线条 (2.2MB)
  ];

  return videoUrls[Math.floor(Math.random() * videoUrls.length)];
};

// 图片 URL 列表（真实可用的随机图片）
export const getRandomImgUrl = () => {
  const ImgUrls = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
    img15,
    img16,
    img17,
    img18,
    img19,
    img20,
    img21,
    img22,
    img23,
    img24,
    img25,
    img26,
    img27,
    img28,
    img29,
    img30,
    img31,
    img32,
    img33,
    img34,
    img35,
    img36,
    img37,
    img38,
    img39,
    img40,
  ];

  return ImgUrls[Math.floor(Math.random() * ImgUrls.length)];
};

// 模拟 API 请求（实际项目需替换为真实接口）
export const fetchPosts = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { type = "mixed", page = 1, pageSize = 10 } = params;

      // 根据 type 参数决定生成数据类型
      const mockList = Array.from({ length: pageSize }, (_, index) => {
        let isVideo;
        if (type === "video") {
          isVideo = true;
        } else if (type === "image") {
          isVideo = false;
        } else {
          // mixed 类型，30% 概率视频
          isVideo = Math.random() < 0.3;
        }

        const randomHeight = Math.floor(Math.random() * 300) + 200; // 200-500px 随机高度

        return {
          id: `post-${page}-${index}`,
          type: isVideo ? "video" : "image",
          title: `${isVideo ? "视频" : "图片"} ${page}-${index + 1}`,
          mediaUrl: isVideo ? getRandomVideoUrl() : getRandomImgUrl(),
          height: randomHeight,
          describe: `描述 ${page}-${index + 1}`,
          userName: `用户 ${page}-${index + 1}`,
          likeCount: Math.floor(Math.random() * 50),
          isLiked: Math.random() < 0.5,
        };
      });

      // 模拟分页：最多5页
      const hasMore = page < 8;

      resolve({
        data: {
          list: mockList,
          hasMore,
        },
      });
    }, 800); // 模拟网络延迟
  });
};
