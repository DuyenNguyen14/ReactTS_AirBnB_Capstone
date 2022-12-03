import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../redux/configStore";
import {
  CommentType,
  getAllComments,
} from "../../../redux/reducers/commentReducer";
import { getUserById, User } from "../../../redux/reducers/userReducer";
import CommentCard from "./CommentCard";
import _ from "lodash";
import { getStoreJSON, USER_LOGIN } from "../../../util/setting";

let timeout: ReturnType<typeof setTimeout>;

type Props = {};

export default function Comment({}: Props) {
  const { arrComments, success } = useSelector(
    (state: RootState) => state.commentReducer
  );
  console.log(arrComments);
  const { userInfo } = useSelector((state: RootState) => state.userReducer);

  const [roomComments, setRoomComments] = useState<CommentType[]>([]);
  console.log({ roomComments });
  const [userIds, setUserIds] = useState<number[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  console.log({ userList });
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [visible, setVisible] = useState(4);
  const [rating, setRating] = useState(0);
  console.log({ rating });

  const { roomId } = useParams();
  const user: User = getStoreJSON(USER_LOGIN);

  const dispatch: AppDispatch = useDispatch();

  const showComments = (moreOrLess: boolean) => {
    if (moreOrLess) {
      setVisible((prevState) => prevState + 4);
    } else {
      setVisible(4);
    }
  };

  const renderRoomComments = useCallback(() => {
    if (!isFetching) {
      if (roomComments.length > 0) {
        return roomComments.slice(0, visible).map((comment) => {
          console.log(visible);
          return (
            <div className="col-6" key={comment.id}>
              <CommentCard
                comment={comment}
                user={userList.filter((user) =>
                  user.id === comment.maNguoiBinhLuan ? user : null
                )}
              />
            </div>
          );
        });
      }
      return (
        <p>
          Chưa có đánh giá cho phòng này! Hãy là người đầu tiên để lại bình
          luận!
        </p>
      );
    }
  }, [roomComments, userList, isFetching, visible]);

  // const formik = useFormik<CommentType>({
  //   initialValues: {
  //     id: 0,
  //     maPhong: Number(roomId),
  //     maNguoiBinhLuan: user.id,
  //     ngayBinhLuan: moment(new Date()).format("DD/MM/YYYY"),
  //     noiDung: "",
  //     saoBinhLuan: rating,
  //   },
  //   onSubmit: async (values) => {
  //     values.saoBinhLuan = rating;
  //     console.log(values);
  //     await dispatch(sendComment(values));
  //   },
  // });

  useEffect(() => {
    dispatch(getAllComments());
    return () => {
      console.log("clean");
    };
  }, []);

  useEffect(() => {
    if (arrComments.length > 0) {
      setRoomComments(
        arrComments.filter(
          (comment: CommentType) => comment.maPhong.toString() === roomId
        )
      );
    }
  }, [arrComments, roomId]);

  useEffect(() => {
    if (roomComments.length > 0) {
      setUserIds(
        _.uniq(roomComments.map((comment) => comment.maNguoiBinhLuan))
      );
    }
    return () => {
      setUserIds([]);
    };
  }, [roomComments]);

  useEffect(() => {
    timeout = setTimeout(async () => {
      if (userIds.length > 0) {
        for (const id of userIds) {
          await dispatch(getUserById(id));
          if (userIds.indexOf(id) === userIds.length - 1) {
            setIsFetching(false);
            console.log({ userList });
          }
        }
      }
      if (userIds.length === 0) setIsFetching(false);
    }, 800);
    return () => {
      if (timeout) clearTimeout(timeout);
      // setUserList([]);
    };
  }, [userIds]);

  useEffect(() => {
    if (userIds.length > 0 && userInfo && userInfo.id) {
      console.log("render");
      setUserList((prevState) => _.uniqBy([...prevState, userInfo], "id"));
    }
    // return () => {
    //   setUserList([]);
    // };
  }, [userInfo, userIds]);

  useEffect(() => {
    return () => {
      setRoomComments([]);
      setUserIds([]);
      setUserList([]);
    };
  }, []);

  return (
    <>
      <div className="comment--colums row">
        <h3 className="d-flex">
          {`Đánh giá (${roomComments.length})`} -{" "}
          {Math.round(
            roomComments.reduce((total, cmt) => total + cmt.saoBinhLuan, 0) /
              roomComments.length
          )}
          <i className="fa fa-star ms-3"></i>
        </h3>
        {renderRoomComments()}
        {roomComments.length > 4 ? (
          visible < roomComments.length ? (
            <button
              className="btn btn-danger"
              onClick={() => showComments(true)}
            >
              Show more
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => showComments(false)}
            >
              Show less
            </button>
          )
        ) : (
          ""
        )}
      </div>
      {/* <div className="comment-form mt-3">
        <h4>Viết review của bạn cho phòng này!</h4>
        <Rating
          rating={rating}
          onRating={(rate) => setRating(rate)}
          count={5}
        />
        <p>Đánh giá - {rating}</p>
        <form className="row gap-0" onSubmit={formik.handleSubmit}>
          <div className="col-10">
            <textarea
              name="noiDung"
              id="noiDung"
              className="form-control"
              onChange={formik.handleChange}
            ></textarea>
          </div>
          <button
            className="btn btn--primary col-2"
            type="submit"
            onClick={forceUpdate}
          >
            <i className="far fa-paper-plane"></i>
          </button>
        </form>
      </div> */}
    </>
  );
}
