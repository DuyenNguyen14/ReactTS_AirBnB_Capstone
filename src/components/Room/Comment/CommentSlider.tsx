import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import CommentCard from "./CommentCard";
import { Pagination } from "swiper";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRoomByIdApi } from "../../../redux/reducers/roomReducer";
import { AppDispatch, RootState } from "../../../redux/configStore";

type Props = {};

export default function CommentSlider({}: Props) {
  const { arrComments } = useSelector(
    (state: RootState) => state.commentReducer
  );
  console.log(arrComments);

  const { roomId } = useParams();
  console.log(roomId);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getRoomByIdApi(roomId));
  }, [roomId]);
  return (
    <>
      <Swiper
        className="commentSlider"
        slidesPerView={1.5}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        style={{ paddingBottom: "25px", zIndex: "-1" }}
      >
        {/* <SwiperSlide>
          <div className="comment-card--border">
            <CommentCard />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="comment-card--border">
            <CommentCard />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="comment-card--border">
            <CommentCard />
          </div>
        </SwiperSlide> */}
      </Swiper>
    </>
  );
}
