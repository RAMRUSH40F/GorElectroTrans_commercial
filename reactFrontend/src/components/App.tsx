import React from "react";
import Router from "./Router";
// import axios from "axios";

const App: React.FC = () => {
    // React.useEffect(() => {
    //     axios
    //         .get("http://82.146.38.158:8081/dep_1/students/data", {
    //             headers: {
    //                 "Access-Control-Allow-Origin": "*",
    //             },
    //             withCredentials: true,
    //         })
    //         .then((data) => console.log(data));
    // }, []);

    return <Router />;
};

export default App;
