import React, { useMemo, useState } from "react";

type Props = {
  count?: number;
  rating: number;
  onRating: (idx: number) => void;
};

export default function Rating({ count = 5, rating = 0, onRating }: Props) {
  const color: { filled: "#f5eb3b"; unfilled: "#DCDCDC" } = {
    filled: "#f5eb3b",
    unfilled: "#DCDCDC",
  };

  const [hoverRating, setHoverRating] = useState(0);

  const getColor = (index: number) => {
    if (hoverRating >= index) {
      return color.filled;
    } else if (!hoverRating && rating >= index) {
      return color.filled;
    }
    return color.unfilled;
  };

  const starRating = useMemo(() => {
    return Array(count)
      .fill(0)
      .map((_, i) => i + 1)
      .map((idx) => {
        return (
          <i
            key={idx}
            className="fa fa-star cursor-pointer"
            onClick={() => onRating(idx)}
            style={{ color: getColor(idx) }}
            onMouseEnter={() => setHoverRating(idx)}
            onMouseLeave={() => setHoverRating(0)}
          ></i>
        );
      });
  }, [count, rating, hoverRating]);

  return <div>{starRating}</div>;
}
