import React from "react";
import { CommentType } from "../../../redux/reducers/commentReducer";
import { User } from "../../../redux/reducers/userReducer";

type Props = {
  comment: CommentType;
  user: (User | null)[];
};

export default function CommentCard({ comment, user }: Props) {
  const renderCommentCard = () => {
    if (user.length > 0) {
      return (user as User[]).map((u: User, index) => {
        if (u.id === comment.maNguoiBinhLuan) {
          return (
            <div className="comment-card" key={u.id + index}>
              <div className="comment-card__heading d-flex">
                <img src={u.avatar} alt="..." />
                <div className="comment-card__heading__name w-70">
                  <h3>{u.name}</h3>
                  <p>{comment.ngayBinhLuan}</p>
                </div>
              </div>
              <div className="comment-card__text">{comment.noiDung}</div>
            </div>
          );
        }
      });
    }
    return (
      <div className="comment-card">
        <div className="comment-card__heading d-flex">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
            alt="..."
          />
          <div className="comment-card__heading__name w-70">
            <h3>Tài khoản đã xoá</h3>
            <p>{comment.ngayBinhLuan}</p>
          </div>
        </div>
        <div className="comment-card__text">{comment.noiDung}</div>
      </div>
    );
  };

  return <>{renderCommentCard()}</>;
}
