import { buttonBaseClasses } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import styled from "styled-components";
import ReviewDelete from "../pages/Review/ReviewDelete";
import { useI18n } from "../../hooks/useI18n";
import { Card, CardBody, Image, Button } from "@nextui-org/react";
// import BoogieNone from "../../assets/boogie_none.png";
import { StarFilled } from "@ant-design/icons";
import "moment/locale/ko";
import moment from "moment";

function ReviewCard({ ReviewData, isMe }) {
  const t = useI18n();
  const [reviews, setReviews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setReviews(ReviewData);
  }, []);

  moment.locale("ko");

  // 수정하기로 데이터 넘겨주기
  const handleEditClick = (review) => {
    navigate(`/review/${review.id}/edit`, {
      state: {
        tourId: review.tourId,
        title: review.title,
        content: review.content,
        score: review.score,
      },
    });
  };

  function reviewDelete(id) {
    const updatedReviews = reviews.filter((review) => review.id !== id);
    setReviews(updatedReviews);
  }

  return (
    <div className="max-w-[400px] md:max-w-[610px] py-12">
      {reviews ? (
        reviews.length > 0 ? (
          reviews.map((review) => (
            <Card
              key={review.id}
              isBlurred
              className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] mb-4"
              shadow="sm"
            >
              <CardBody>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                  <div className="relative col-span-6 md:col-span-4">
                    <Image
                      alt="Album cover"
                      className=""
                      shadow="sm"
                      src={
                        review.tourImageUrls != []
                          ? review.tourImageUrls[0]
                          : "https://datacdn.ibtravel.co.kr/files/2023/05/09182530/226b2f068fe92fe9e423f7f17422d994_img-1.jpeg"
                      }
                      style={{
                        width: "400px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div className="flex flex-col col-span-6 md:col-span-8">
                    <div className="text-xs md:text-sm w-full text-right text-zinc-400">
                      {moment(review.date)
                        .utcOffset(9)
                        .format("YYYY/MM/DD HH:mm")}
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-0">
                        <h1 className="text-base font-semibold mt-1 ">
                          <Link to={`../../tour/${review.tourId}`}>
                            {review.tourTitle}
                          </Link>
                        </h1>
                        <div className="my-1">
                          <p className="font-semibold">
                            "{review.title}"
                            <div className="flex items-center gap-1 text-blue-600 text-base">
                              <StarFilled />
                              {review.score}
                            </div>
                          </p>
                          <p>
                            {review.content
                              .replace(/(<([^>]+)>)/gi, "")
                              .replace("&gt;", "")
                              .replace("&lt;", "")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-center"></div>
                  </div>
                </div>
                <div className="flex flex-col justify-center mt-4">
                  <div>
                    {isMe && (
                      <Button
                        className="mt-3 bg-blue-50 p-3 rounded-md w-full"
                        color="primary"
                        variant="flat"
                        onClick={() => handleEditClick(review)}
                      >
                        {t(`리뷰 수정하기`)}
                      </Button>
                    )}
                  </div>
                  <div>
                    {isMe && (
                      <ReviewDelete
                        reviewId={review.id}
                        userId={review.userId}
                        reviewDelete={reviewDelete}
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <></>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ReviewCard;
