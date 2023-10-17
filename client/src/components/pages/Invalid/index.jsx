import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Invalid = () => {
    const [isExpired, setIsExpired] = useState(false);
    const { expired } = useParams();
    useEffect(() => {
        setIsExpired(true);
    }, [expired]);
    // const
    return <div>{isExpired ? "Link has expired" : "Invalid request accessed"}</div>;
};

export default Invalid;
