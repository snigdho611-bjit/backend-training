import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const GetFile = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  return (
    <div>
      <img src={`${import.meta.env.VITE_BACKEND}/files/get/${searchParams.get(
        "filepath"
      )}`} alt="" />
      <a
        href={`${import.meta.env.VITE_BACKEND}/files/get/${searchParams.get(
          "filepath"
        )}`}
        download
      >
        Get File
      </a>
    </div>
  );
};

export default GetFile;
