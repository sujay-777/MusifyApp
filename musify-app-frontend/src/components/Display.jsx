import {Route, Routes, useLocation} from "react-router-dom";
import DisplayHome from "./DisplayHome.jsx";
import Search from "./Search.jsx";
import DisplayAlbum from "./DisplayAlbum.jsx";
import Navbar from "./Navbar.jsx";
import {useContext, useEffect, useRef} from "react";
import {PlayerContext} from "../context/PlayerContext.jsx";

const Display = () => {
    const {albumsData} = useContext(PlayerContext);
    const displayRef = useRef();
    const location = useLocation();
    const isAlbum = location.pathname.includes("album");
    const albumId = isAlbum ? location.pathname.split("/").pop() : "";
    const album = isAlbum ? albumsData.find(x => x._id == albumId) : null;
    const bgColor = album?.bgColour || '#121212';

    useEffect(() => {
        if(isAlbum) {
            displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
        } else {
            displayRef.current.style.background = '#121212';
        }
    }, [isAlbum, bgColor]);

    return (
        <div ref={displayRef} className="w-[100%] m-2 bg-[#121212] text-white lg:w-[75%] lg:ml-0 flex flex-col">
            {/* Sticky navbar */}
            <div  className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800/50 px-6 pt-4 pb-2">
                <Navbar />
            </div>
            {/* Scrollable content */}
            <div className="flex-1 px-6 pb-4 overflow-auto">
                <Routes>
                    <Route path="/" element={<DisplayHome />} />
                    <Route path="/album/:id" element={<DisplayAlbum album={albumsData.find(x => x._id == albumId)}/>} />
                    <Route path="/search" element={<Search />} />
                </Routes>
            </div>
        </div>
    )
}

export default Display;