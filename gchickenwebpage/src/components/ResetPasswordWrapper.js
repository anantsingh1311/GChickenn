import React from "react";
import { useParams } from "react-router-dom";
import ResetPassword from "./ResetPassword";

export default function ResetPasswordWrapper() {
  const params = useParams();
  return <ResetPassword params={params} />;
}