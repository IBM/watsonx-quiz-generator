import React from "react";
import Loading from "./Loading";
interface Page3Props {
  handlePageChange: (newPage: number) => void;
}

function Page3({}: Page3Props) {
  return (
    <div>
      <Loading open={true} />
    </div>
  );
}

export default Page3;
