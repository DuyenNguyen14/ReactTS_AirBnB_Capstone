import React from "react";

const loadingGif = require("../../assets/img/loading-2.gif");

type Props = {};

export default function LoadingHorizontal({}: Props) {
  return <img style={{ width: "50px" }} src={loadingGif} alt="loading..." />;
}
